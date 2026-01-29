export interface MongoDBMessage {
  _id: {
    $oid: string;
  };
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  agent_id: string | null;
  correlation_id: string | null;
  mem0_ids: string[];
  metadata: Record<string, any>;
  created_at: {
    $date: string;
  };
}

export interface Conversation {
  conversation_id: string;
  messages: MongoDBMessage[];
  user_id: string;
  start_time: Date;
  end_time: Date;
  message_count: number;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIFormat {
  messages: OpenAIMessage[];
}

export interface AnthropicFormat {
  prompt: string;
  completion: string;
}

export interface AlpacaFormat {
  instruction: string;
  input: string;
  output: string;
}

export interface ShareGPTMessage {
  from: 'human' | 'gpt' | 'system';
  value: string;
}

export interface ShareGPTFormat {
  conversations: ShareGPTMessage[];
}

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

export interface ConversionResult {
  data: any[];
  format: OutputFormat;
  stats: {
    totalConversations: number;
    totalMessages: number;
    totalTokensEstimate: number;
  };
}

export interface FileUploadResult {
  fileId: string;
  filename: string;
  size: number;
  uploadedAt: Date;
  messageCount: number;
  conversationCount: number;
}