import React, { useState } from 'react';
import { X, Key } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKey, setApiKey }) => {
  const [inputKey, setInputKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(inputKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="text-sky-400" />
            API Configuration
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Google Gemini API Key</label>
            <input 
              type="password" 
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIza..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">
              Required for intelligent analysis and keyword suggestions.
            </p>
          </div>

          <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg">
             <p className="text-xs text-blue-200">
               <strong>Note on functionality:</strong> This app simulates the Python backend logic requested. Since direct client-side calls to Ahrefs or Presearch APIs are restricted by CORS and security policies, we use Gemini to simulate the data retrieval and scoring logic for demonstration.
             </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-6 rounded-lg transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;