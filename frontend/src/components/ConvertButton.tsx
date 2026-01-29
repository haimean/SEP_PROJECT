import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useAppStore } from '../hooks/useAppStore';
import toast from 'react-hot-toast';

export const ConvertButton: React.FC = () => {
  const { uploadedFile, conversionOptions } = useAppStore();

  const convertMutation = useMutation({
    mutationFn: () =>
      apiService.convertData(uploadedFile!.fileId, conversionOptions),
    onSuccess: (data) => {
      // Download file
      const blob = new Blob([data.output], {
        type: data.filename.endsWith('.jsonl')
          ? 'application/x-ndjson'
          : 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Conversion completed and file downloaded!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Conversion failed');
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['stats', uploadedFile?.fileId],
    queryFn: () => apiService.getStats(uploadedFile!.fileId),
    enabled: !!uploadedFile,
  });

  if (!uploadedFile) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-200">
          <h3 className="font-semibold text-gray-900 mb-4">File Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {stats.conversationCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Conversations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {stats.messageCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Messages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {stats.uniqueUsers}
              </div>
              <div className="text-sm text-gray-600">Unique Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {stats.avgMessagesPerConversation}
              </div>
              <div className="text-sm text-gray-600">Avg Msg/Conv</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-primary-200">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Date Range:</span>{' '}
              {new Date(stats.dateRange.earliest).toLocaleDateString()} -{' '}
              {new Date(stats.dateRange.latest).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* Convert Button */}
      <button
        onClick={() => convertMutation.mutate()}
        disabled={convertMutation.isPending}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {convertMutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Converting...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Convert & Download</span>
          </>
        )}
      </button>

      {convertMutation.data && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">
            Conversion Summary
          </h4>
          <div className="space-y-1 text-sm text-green-800">
            <p>
              ✓ Converted {convertMutation.data.stats.totalConversations}{' '}
              conversations
            </p>
            <p>
              ✓ Total messages: {convertMutation.data.stats.totalMessages}
            </p>
            <p>
              ✓ Estimated tokens:{' '}
              {convertMutation.data.stats.totalTokensEstimate.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};