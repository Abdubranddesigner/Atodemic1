import React, { useState } from 'react';
import { useAtodemicStore } from '../context/AppContext';
import { 
  FolderPlus, 
  FileText, 
  Youtube, 
  Video, 
  Globe, 
  Image, 
  CheckCircle, 
  Trash2, 
  ExternalLink,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function ResourceVault() {
  const store = useAtodemicStore();
  const { vaultItems } = store;

  // Upload item form state
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<any>('pdf');
  const [url, setUrl] = useState('');

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    store.addVaultItem(title, type, url);

    setTitle('');
    setType('pdf');
    setUrl('');
    setIsAdding(false);
  };

  const getTypeIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'pdf': return <FileText className="h-5 w-5 text-zinc-100" />;
      case 'youtube': return <Youtube className="h-5 w-5 text-zinc-100" />;
      case 'video': return <Video className="h-5 w-5 text-zinc-200" />;
      case 'website': return <Globe className="h-5 w-5 text-zinc-105 text-zinc-200" />;
      case 'image': return <Image className="h-5 w-5 text-zinc-200" />;
      default: return <FileText className="h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Selection */}
      <div className="flex justify-between items-center bg-zinc-900/10 p-4 rounded-xl border border-zinc-805 border-zinc-800">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">Literature datastore</span>
          <h2 className="text-base font-bold text-zinc-100 mt-1 font-sans">Resource Vault</h2>
        </div>
        {!isAdding && (
          <button
            id="btn_show_vault_form"
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_1px_4px_rgba(255,255,255,0.05)]"
          >
            <FolderPlus className="h-4 w-4" /> Index Resource
          </button>
        )}
      </div>

      {/* Add resource item form */}
      {isAdding && (
        <form onSubmit={handleInsert} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2 font-sans"><FolderPlus className="h-4.5 w-4.5 text-zinc-400" /> Index Study Resource</h3>
            <button
              id="btn_cancel_add_vault"
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-zinc-400 hover:text-white cursor-pointer text-xs font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Resource Title</label>
              <input
                id="vault_title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Campbell Biology Chapter 4 PDF review"
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-[#09090b]/60 text-zinc-100 placeholder:text-zinc-650 text-xs focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Format</label>
                <select
                  id="vault_type"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-2 py-2.5 bg-[#09090b]/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 transition-colors"
                >
                  <option value="pdf">PDF Doc</option>
                  <option value="youtube">YouTube</option>
                  <option value="video">MP4 Video</option>
                  <option value="website">URL Web</option>
                  <option value="image">Diagram</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Resource Link (URL)</label>
                <input
                  id="vault_url"
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/materials..."
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-[#09090b]/60 text-zinc-100 placeholder:text-zinc-650 text-xs focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            id="btn_submit_vault"
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer block ml-auto"
          >
            Secure Source Progress Map
          </button>
        </form>
      )}

      {/* Main List view */}
      {vaultItems.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-zinc-800/85 rounded-2xl p-6">
          <FileText className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
          <h4 className="font-bold text-zinc-200 text-sm font-sans">Vault is static</h4>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed max-w-sm mx-auto">
            Organize syllabi literature sheets, recorded video streams or link research directly to establish index checkpoints.
          </p>
          <button
            id="btn_empty_add_vault"
            onClick={() => setIsAdding(true)}
            className="mt-6 px-4 py-2 bg-[#09090b] border border-zinc-800 hover:bg-zinc-900 text-zinc-100 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Collect First Material Link
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaultItems.map(item => {
            return (
              <div 
                key={item.id} 
                className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/20 flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-9 w-9 bg-zinc-950/80 rounded-lg flex items-center justify-center border border-zinc-800">
                      {getTypeIcon(item.type)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="referrer noopener"
                        className="text-zinc-550 hover:text-white p-1 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        id={`btn_delete_vault_${item.id}`}
                        onClick={() => store.deleteVaultItem(item.id)}
                        className="text-zinc-650 hover:text-white p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs text-zinc-200 leading-snug font-sans">{item.title}</h4>
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider inline-block mt-1 truncate max-w-[180px]">
                    {item.url}
                  </span>

                  {/* Slider Progress Controller */}
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-[11px] font-mono leading-none">
                      <span className="text-zinc-400">Study Progress</span>
                      <span className="text-zinc-100 font-bold">{item.progress}%</span>
                    </div>

                    <input
                      id={`vault_progress_slider_${item.id}`}
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={item.progress}
                      onChange={(e) => store.updateVaultProgress(item.id, parseInt(e.target.value))}
                      className="w-full h-1 bg-[#09090b] rounded-lg appearance-none cursor-pointer accent-zinc-100"
                    />
                  </div>
                </div>

                {item.isCompleted && (
                  <div className="mt-4 flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold font-mono">
                    <CheckCircle className="h-4 w-4 text-zinc-350" /> Complete checkpoint resolved
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
