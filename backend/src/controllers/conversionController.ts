import { Request, Response } from 'express';
import { ConversionService } from '../services/conversionService';
import { MongoDBMessage, ConversionOptions } from '../types';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
//import path from 'path';

const conversionService = new ConversionService();

// Lưu trữ tạm thời trong memory (production nên dùng Redis hoặc database)
const fileStorage = new Map<string, { data: MongoDBMessage[]; metadata: any }>();

export class ConversionController {
  /**
   * Upload file JSON
   */
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const fileContent = await fs.readFile(req.file.path, 'utf-8');
      const messages: MongoDBMessage[] = JSON.parse(fileContent);

      if (!Array.isArray(messages)) {
        res.status(400).json({ error: 'Invalid JSON format. Expected array of messages.' });
        return;
      }

      const fileId = uuidv4();
      const conversations = conversionService.groupByConversations(messages);

      fileStorage.set(fileId, {
        data: messages,
        metadata: {
          filename: req.file.originalname,
          size: req.file.size,
          uploadedAt: new Date(),
          messageCount: messages.length,
          conversationCount: conversations.length,
        },
      });

      // Xóa file tạm
      await fs.unlink(req.file.path);

      res.json({
        fileId,
        filename: req.file.originalname,
        size: req.file.size,
        uploadedAt: new Date(),
        messageCount: messages.length,
        conversationCount: conversations.length,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: 'Failed to process file',
        details: error.message 
      });
    }
  }

  /**
   * Convert dữ liệu
   */
  async convertData(req: Request, res: Response): Promise<void> {
    try {
      const { fileId, options } = req.body as {
        fileId: string;
        options: ConversionOptions;
      };

      const stored = fileStorage.get(fileId);
      if (!stored) {
        res.status(404).json({ error: 'File not found. Please upload again.' });
        return;
      }

      const result = conversionService.convert(stored.data, options);

      // Format output dựa vào format type
      let output: string;
      const isJsonl = options.format === 'openai' || options.format === 'anthropic';

      if (isJsonl) {
        // JSONL format: mỗi dòng là một JSON object
        output = result.data.map((item) => JSON.stringify(item)).join('\n');
      } else {
        // JSON format: array of objects
        output = JSON.stringify(result.data, null, 2);
      }

      res.json({
        ...result,
        output,
        filename: `converted_${options.format}_${Date.now()}.${
          isJsonl ? 'jsonl' : 'json'
        }`,
      });
    } catch (error: any) {
      console.error('Conversion error:', error);
      res.status(500).json({ 
        error: 'Failed to convert data',
        details: error.message 
      });
    }
  }

  /**
   * Lấy thống kê về file
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;

      const stored = fileStorage.get(fileId);
      if (!stored) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const conversations = conversionService.groupByConversations(stored.data);

      // Phân tích thêm
      const userIds = new Set(stored.data.map((m) => m.user_id));
      const avgMessagesPerConv =
        stored.data.length / conversations.length;

      const dateRange = {
        earliest: new Date(
          Math.min(
            ...stored.data.map((m) => new Date(m.created_at.$date).getTime())
          )
        ),
        latest: new Date(
          Math.max(
            ...stored.data.map((m) => new Date(m.created_at.$date).getTime())
          )
        ),
      };

      res.json({
        ...stored.metadata,
        uniqueUsers: userIds.size,
        avgMessagesPerConversation: avgMessagesPerConv.toFixed(2),
        dateRange,
      });
    } catch (error: any) {
      console.error('Stats error:', error);
      res.status(500).json({ 
        error: 'Failed to get stats',
        details: error.message 
      });
    }
  }

  /**
   * Xem trước dữ liệu
   */
  async previewData(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const limit = parseInt(req.query.limit as string) || 5;

      const stored = fileStorage.get(fileId);
      if (!stored) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const conversations = conversionService.groupByConversations(stored.data);
      const preview = conversations.slice(0, limit).map((conv) => ({
        conversation_id: conv.conversation_id,
        user_id: conv.user_id,
        message_count: conv.message_count,
        start_time: conv.start_time,
        messages: conv.messages.map((m) => ({
          role: m.role,
          content: m.content.substring(0, 200) + (m.content.length > 200 ? '...' : ''),
          created_at: m.created_at.$date,
        })),
      }));

      res.json({
        preview,
        total: conversations.length,
        showing: preview.length,
      });
    } catch (error: any) {
      console.error('Preview error:', error);
      res.status(500).json({ 
        error: 'Failed to preview data',
        details: error.message 
      });
    }
  }

  /**
   * Xóa file khỏi storage
   */
  async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;

      if (!fileStorage.has(fileId)) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      fileStorage.delete(fileId);
      res.json({ message: 'File deleted successfully' });
    } catch (error: any) {
      console.error('Delete error:', error);
      res.status(500).json({ 
        error: 'Failed to delete file',
        details: error.message 
      });
    }
  }
}