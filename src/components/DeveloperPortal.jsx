import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Check, Trash2, Code2, Terminal, ShieldCheck, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api.js';

export default function DeveloperPortal({ showToast }) {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyName, setKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showSecretId, setShowSecretId] = useState(null);
  const [activeCodeLang, setActiveCodeLang] = useState('curl'); // 'curl' | 'python' | 'node'

  const loadKeys = async () => {
    setLoading(true);
    try {
      const data = await api.getApiKeys();
      setApiKeys(data.apiKeys || []);
    } catch (err) {
      console.error(err);
      if (showToast) showToast(`Error loading API keys: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleCreateKey = async (e) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    setCreating(true);

    try {
      const res = await api.createApiKey(keyName.trim());
      if (showToast) showToast(res.message);
      setKeyName('');
      await loadKeys();
    } catch (err) {
      if (showToast) showToast(`Error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeKey = async (keyId) => {
    if (!confirm('Are you sure you want to revoke this API key? Apps using this key will immediately lose access.')) return;
    try {
      const res = await api.revokeApiKey(keyId);
      if (showToast) showToast(res.message);
      await loadKeys();
    } catch (err) {
      if (showToast) showToast(`Error: ${err.message}`);
    }
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (showToast) showToast('API Key copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeKey = apiKeys.find(k => k.status === 'active')?.apiKey || 'ep_live_sample_key_12345';

  const codeSnippets = {
    curl: `curl -X GET "http://localhost:5000/api/projects" \\
  -H "X-API-KEY: ${activeKey}"`,
    python: `import requests

url = "http://localhost:5000/api/projects"
headers = {
    "X-API-KEY": "${activeKey}"
}

response = requests.get(url, headers=headers)
data = response.json()

print(f"Total Projects: {data['totalCount']}")
print(f"Access Level: {data['accessLevel']}")`,
    node: `const response = await fetch("http://localhost:5000/api/projects", {
  headers: {
    "X-API-KEY": "${activeKey}"
  }
});

const data = await response.json();
console.log("Projects:", data.projects);`
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-cyan-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Key className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Enterprise B2B Developer API Portal
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Programmatically query full real estate intelligence data, developer contact matrices, and sanitary specifications directly into your ERP/CRM systems.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authenticated B2B Access
        </span>
      </div>

      {/* Generate API Key Card */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-400" /> Generate New B2B API Access Key
        </h3>

        <form onSubmit={handleCreateKey} className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px]">
            <input
              type="text"
              placeholder="API Key Name (e.g. SAP Integration, Sales CRM, Mobile App)..."
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={creating || !keyName.trim()}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-glow flex items-center gap-2 disabled:opacity-50"
          >
            {creating ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
              <>
                <Key className="w-4 h-4" /> Generate API Key
              </>
            )}
          </button>
        </form>
      </div>

      {/* API Keys Table */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" /> Active B2B API Keys ({apiKeys.length})
          </h3>
          <button onClick={loadKeys} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl text-slate-400 text-xs">
            No active API keys generated yet. Use the form above to issue a persistent B2B API Key.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
                  <th className="p-3">Key Name</th>
                  <th className="p-3">API Secret Key (`X-API-KEY`)</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {apiKeys.map(k => {
                  const isVisible = showSecretId === k.id;
                  const isRevoked = k.status === 'revoked';

                  return (
                    <tr key={k.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-white">{k.name}</td>
                      <td className="p-3 font-mono text-emerald-400 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                            {isVisible ? k.apiKey : `${k.apiKey.slice(0, 12)}••••••••••••••••`}
                          </span>
                          <button
                            onClick={() => setShowSecretId(isVisible ? null : k.id)}
                            className="text-[10px] text-slate-400 hover:text-white underline"
                          >
                            {isVisible ? 'Hide' : 'Reveal'}
                          </button>
                          <button
                            onClick={() => copyText(k.apiKey, k.id)}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Copy API Key"
                          >
                            {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {new Date(k.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isRevoked ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {k.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {!isRevoked && (
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1 ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Revoke Key
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Code Integration Guide */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-400" /> API Integration Code Snippets
            </h3>
            <p className="text-xs text-slate-400">Pass header `X-API-KEY` to authenticate programmatic REST API calls</p>
          </div>

          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveCodeLang('curl')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeCodeLang === 'curl' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveCodeLang('python')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeCodeLang === 'python' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveCodeLang('node')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeCodeLang === 'node' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Node.js
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
          <pre>{codeSnippets[activeCodeLang]}</pre>
          <button
            onClick={() => copyText(codeSnippets[activeCodeLang], 'code')}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            {copiedId === 'code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

    </div>
  );
}
