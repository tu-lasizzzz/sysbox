import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import FileExplorer from '../components/FileExplorer';
import CodeEditor from '../components/CodeEditor';
import { listFiles } from '../services/api';

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listFiles();
      setFiles(data.files || []);
    } catch {
      toast.error('Failed to load files.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text-main">Code Workspace</h1>
        <p className="text-text-muted text-sm mt-1">Create, edit, and manage workspace files</p>
      </div>

      {/* Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-slide-up opacity-0" style={{ animationDelay: '50ms' }}>
        <div className="lg:col-span-4 xl:col-span-3">
          <FileExplorer
            files={files}
            loading={loading}
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            onRefresh={fetchFiles}
          />
        </div>
        <div className="lg:col-span-8 xl:col-span-9 min-h-[480px]">
          <CodeEditor fileName={selectedFile} onSaved={fetchFiles} />
        </div>
      </div>
    </div>
  );
}
