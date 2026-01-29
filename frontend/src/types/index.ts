export type OutputFormat = 'openai' | 'anthropic' | 'alpaca' | 'sharegpt';

export interface ConversionOptions {
  format: OutputFormat;
  includeSystemPrompt?: boolean;
  systemPrompt?: string;
  filterByUser?: string;
  filterByConversation?: string;
  startDate?: string;
  endDate?: string;
  removeThinkTags?: boolean;
  maxMessagesPerConversation?: number;
}

export interface FileUploadResult {
  fileId: string;
  filename: string;
  size: number;
  uploadedAt: string;
  messageCount: number;
  conversationCount: number;
}

export interface ConversionResult {
  data: any[];
  format: OutputFormat;
  output: string;
  filename: string;
  stats: {
    totalConversations: number;
    totalMessages: number;
    totalTokensEstimate: number;
  };
}

export interface FileStats extends FileUploadResult {
  uniqueUsers: number;
  avgMessagesPerConversation: string;
  dateRange: {
    earliest: string;
    latest: string;
  };
}

export interface PreviewData {
  preview: Array<{
    conversation_id: string;
    user_id: string;
    message_count: number;
    start_time: string;
    messages: Array<{
      role: string;
      content: string;
      created_at: string;
    }>;
  }>;
  total: number;
  showing: number;
}