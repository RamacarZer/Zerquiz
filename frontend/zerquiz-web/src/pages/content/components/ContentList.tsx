import { Eye, Download, Trash2 } from 'lucide-react';

interface ContentFile {
  id: string;
  title: string;
  type: string;
  size: string;
  status: string;
  uploadDate: string;
}

interface ContentListProps {
  files: ContentFile[];
}

export default function ContentList({ files }: ContentListProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'pptx': return '📊';
      default: return '📁';
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ready: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: 'Ready' },
      processing: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', label: 'Processing' },
      failed: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', label: 'Failed' },
    };
    const badge = badges[status as keyof typeof badges] || badges.ready;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {files.map((file) => (
            <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <span className="font-medium text-gray-800 dark:text-white">{file.title}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {file.type.toUpperCase()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {file.size}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(file.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {file.uploadDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

