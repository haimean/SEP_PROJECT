import {
  MongoDBMessage,
  Conversation,
  OpenAIFormat,
  AnthropicFormat,
  AlpacaFormat,
  ShareGPTFormat,
  ConversionOptions,
  ConversionResult,
  
} from '../types';

export class ConversionService {
  /**
   * Nhóm messages thành conversations
   */
  groupByConversations(messages: MongoDBMessage[]): Conversation[] {
    const conversationMap = new Map<string, MongoDBMessage[]>();

    messages.forEach((msg) => {
      if (!conversationMap.has(msg.conversation_id)) {
        conversationMap.set(msg.conversation_id, []);
      }
      conversationMap.get(msg.conversation_id)!.push(msg);
    });

    return Array.from(conversationMap.entries()).map(([id, msgs]) => {
      const sortedMsgs = msgs.sort(
        (a, b) =>
          new Date(a.created_at.$date).getTime() -
          new Date(b.created_at.$date).getTime()
      );

      return {
        conversation_id: id,
        messages: sortedMsgs,
        user_id: msgs[0].user_id,
        start_time: new Date(sortedMsgs[0].created_at.$date),
        end_time: new Date(sortedMsgs[sortedMsgs.length - 1].created_at.$date),
        message_count: sortedMsgs.length,
      };
    });
  }

  /**
   * Lọc conversations theo options
   */
  filterConversations(
    conversations: Conversation[],
    options: ConversionOptions
  ): Conversation[] {
    let filtered = conversations;

    if (options.filterByUser) {
      filtered = filtered.filter((c) => c.user_id === options.filterByUser);
    }

    if (options.filterByConversation) {
      filtered = filtered.filter(
        (c) => c.conversation_id === options.filterByConversation
      );
    }

    if (options.startDate) {
      const startDate = new Date(options.startDate);
      filtered = filtered.filter((c) => c.start_time >= startDate);
    }

    if (options.endDate) {
      const endDate = new Date(options.endDate);
      filtered = filtered.filter((c) => c.end_time <= endDate);
    }

    if (options.maxMessagesPerConversation) {
      filtered = filtered.map((c) => ({
        ...c,
        messages: c.messages.slice(0, options.maxMessagesPerConversation),
      }));
    }

    return filtered;
  }

  /**
   * Xóa <think> tags nếu cần
   */
  cleanContent(content: string, removeThinkTags: boolean): string {
    if (!removeThinkTags) return content;
    
    // Xóa <think>...</think> tags
    return content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  }

  /**
   * Convert sang OpenAI format
   */
  toOpenAIFormat(
    conversations: Conversation[],
    options: ConversionOptions
  ): OpenAIFormat[] {
    return conversations.map((conv) => {
      const messages: OpenAIFormat['messages'] = [];

      if (options.includeSystemPrompt && options.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      }

      conv.messages.forEach((msg) => {
        const content = this.cleanContent(
          msg.content,
          options.removeThinkTags || false
        );
        
        if (content) {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content,
          });
        }
      });

      return { messages };
    });
  }

  /**
   * Convert sang Anthropic format
   */
  toAnthropicFormat(
    conversations: Conversation[],
    options: ConversionOptions
  ): AnthropicFormat[] {
    const results: AnthropicFormat[] = [];

    conversations.forEach((conv) => {
      for (let i = 0; i < conv.messages.length - 1; i += 2) {
        const userMsg = conv.messages[i];
        const assistantMsg = conv.messages[i + 1];

        if (
          userMsg &&
          assistantMsg &&
          userMsg.role === 'user' &&
          assistantMsg.role === 'assistant'
        ) {
          const userContent = this.cleanContent(
            userMsg.content,
            options.removeThinkTags || false
          );
          const assistantContent = this.cleanContent(
            assistantMsg.content,
            options.removeThinkTags || false
          );

          if (userContent && assistantContent) {
            results.push({
              prompt: `Human: ${userContent}\n\nAssistant:`,
              completion: ` ${assistantContent}`,
            });
          }
        }
      }
    });

    return results;
  }

  /**
   * Convert sang Alpaca/LLaMA format
   */
  toAlpacaFormat(
    conversations: Conversation[],
    options: ConversionOptions
  ): AlpacaFormat[] {
    const results: AlpacaFormat[] = [];

    conversations.forEach((conv) => {
      for (let i = 0; i < conv.messages.length - 1; i += 2) {
        const userMsg = conv.messages[i];
        const assistantMsg = conv.messages[i + 1];

        if (
          userMsg &&
          assistantMsg &&
          userMsg.role === 'user' &&
          assistantMsg.role === 'assistant'
        ) {
          const instruction = this.cleanContent(
            userMsg.content,
            options.removeThinkTags || false
          );
          const output = this.cleanContent(
            assistantMsg.content,
            options.removeThinkTags || false
          );

          if (instruction && output) {
            results.push({
              instruction,
              input: '',
              output,
            });
          }
        }
      }
    });

    return results;
  }

  /**
   * Convert sang ShareGPT format
   */
  toShareGPTFormat(
    conversations: Conversation[],
    options: ConversionOptions
  ): ShareGPTFormat[] {
    return conversations.map((conv) => {
      const conversations: ShareGPTFormat['conversations'] = [];

      conv.messages.forEach((msg) => {
        const content = this.cleanContent(
          msg.content,
          options.removeThinkTags || false
        );

        if (content) {
          conversations.push({
            from: msg.role === 'user' ? 'human' : 'gpt',
            value: content,
          });
        }
      });

      return { conversations };
    });
  }

  /**
   * Ước tính số tokens
   */
  estimateTokens(text: string): number {
    // Ước tính đơn giản: 1 token ≈ 4 ký tự (tiếng Việt có thể khác)
    return Math.ceil(text.length / 4);
  }

  /**
   * Convert chính
   */
  convert(
    messages: MongoDBMessage[],
    options: ConversionOptions
  ): ConversionResult {
    // Nhóm thành conversations
    let conversations = this.groupByConversations(messages);

    // Lọc theo options
    conversations = this.filterConversations(conversations, options);

    // Convert theo format
    let data: any[];
    switch (options.format) {
      case 'openai':
        data = this.toOpenAIFormat(conversations, options);
        break;
      case 'anthropic':
        data = this.toAnthropicFormat(conversations, options);
        break;
      case 'alpaca':
        data = this.toAlpacaFormat(conversations, options);
        break;
      case 'sharegpt':
        data = this.toShareGPTFormat(conversations, options);
        break;
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }

    // Tính stats
    const totalMessages = conversations.reduce(
      (sum, c) => sum + c.messages.length,
      0
    );
    const totalText = JSON.stringify(data);
    const totalTokensEstimate = this.estimateTokens(totalText);

    return {
      data,
      format: options.format,
      stats: {
        totalConversations: conversations.length,
        totalMessages,
        totalTokensEstimate,
      },
    };
  }
}