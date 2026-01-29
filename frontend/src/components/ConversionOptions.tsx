import React from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { OutputFormat } from '../types';

const FORMAT_OPTIONS: Array<{ value: OutputFormat; label: string; description: string }> = [
  {
    value: 'openai',
    label: 'OpenAI (JSONL)',
    description: 'For GPT-3.5/GPT-4 fine-tuning',
  },
  {
    value: 'anthropic',
    label: 'Anthropic (JSONL)',
    description: 'For Claude fine-tuning',
  },
  {
    value: 'alpaca',
    label: 'Alpaca/LLaMA (JSON)',
    description: 'For open-source models',
  },
  {
    value: 'sharegpt',
    label: 'ShareGPT (JSON)',
    description: 'Universal format for many tools',
  },
];

export const ConversionOptions: React.FC = () => {
  const { conversionOptions, updateConversionOptions } = useAppStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Conversion Options</h2>

      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Output Format
        </label>
        <div className="space-y-2">
          {FORMAT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="format"
                value={option.value}
                checked={conversionOptions.format === option.value}
                onChange={(e) =>
                  updateConversionOptions({ format: e.target.value as OutputFormat })
                }
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* System Prompt */}
      {conversionOptions.format === 'openai' && (
        <div>
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={conversionOptions.includeSystemPrompt}
              onChange={(e) =>
                updateConversionOptions({ includeSystemPrompt: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Include System Prompt
            </span>
          </label>
          {conversionOptions.includeSystemPrompt && (
            <textarea
              value={conversionOptions.systemPrompt}
              onChange={(e) =>
                updateConversionOptions({ systemPrompt: e.target.value })
              }
              placeholder="Enter system prompt..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
          )}
        </div>
      )}

      {/* Remove Think Tags */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={conversionOptions.removeThinkTags}
            onChange={(e) =>
              updateConversionOptions({ removeThinkTags: e.target.checked })
            }
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Remove &lt;think&gt; tags from content
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-6">
          Automatically strips thinking process tags from assistant responses
        </p>
      </div>

      {/* Max Messages Per Conversation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Messages Per Conversation
        </label>
        <input
          type="number"
          value={conversionOptions.maxMessagesPerConversation || ''}
          onChange={(e) =>
            updateConversionOptions({
              maxMessagesPerConversation: e.target.value
                ? parseInt(e.target.value)
                : undefined,
            })
          }
          placeholder="No limit"
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty for no limit
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-900">Filters (Optional)</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by User ID
          </label>
          <input
            type="text"
            value={conversionOptions.filterByUser || ''}
            onChange={(e) =>
              updateConversionOptions({ filterByUser: e.target.value || undefined })
            }
            placeholder="Enter user ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Conversation ID
          </label>
          <input
            type="text"
            value={conversionOptions.filterByConversation || ''}
            onChange={(e) =>
              updateConversionOptions({
                filterByConversation: e.target.value || undefined,
              })
            }
            placeholder="Enter conversation ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={conversionOptions.startDate || ''}
              onChange={(e) =>
                updateConversionOptions({
                  startDate: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={conversionOptions.endDate || ''}
              onChange={(e) =>
                updateConversionOptions({ endDate: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};