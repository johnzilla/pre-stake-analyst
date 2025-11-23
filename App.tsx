import React, { useState, useEffect } from 'react';
import { Search, Upload, RefreshCw, AlertCircle, Settings, BarChart2, Coins, Info } from 'lucide-react';
import KeywordTable from './components/KeywordTable';
import StatsChart from './components/StatsChart';
import SettingsModal from './components/SettingsModal';
import Tooltip from './components/Tooltip';
import { generateKeywordAnalysis, analyzeCsvData } from './services/geminiService';
import { KeywordOpportunity, AnalysisSource } from './types';

const App: React.FC = () => {
  const [niche, setNiche] = useState('Crypto Wallets');
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<KeywordOpportunity[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(!process.env.API_KEY);
  const [mode, setMode] = useState<AnalysisSource>(AnalysisSource.AI_GENERATED);
  const [prePrice, setPrePrice] = useState<number>(0.015); // Fallback default price

  // Initialize with some data if key is present
  useEffect(() => {
    if (apiKey && data.length === 0) {
      handleAnalyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  // Fetch live PRE price
  useEffect(() => {
    const fetchPrePrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=presearch&vs_currencies=usd');
        const priceData = await res.json();
        if (priceData?.presearch?.usd) {
          setPrePrice(priceData.presearch.usd);
        }
      } catch (error) {
        console.error("Failed to fetch PRE price, using default:", error);
      }
    };
    fetchPrePrice();
  }, []);

  const handleAnalyze = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await generateKeywordAnalysis(niche, apiKey);
      setData(results);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze keywords');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMode(AnalysisSource.CSV_IMPORT);

    try {
      const text = await file.text();
      const results = await analyzeCsvData(text, apiKey);
      setData(results);
    } catch (err: any) {
      setError(err.message || "Failed to parse CSV");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-sky-500/30">
      
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-sky-500/10 p-2 rounded-lg border border-sky-500/20">
                <Coins className="text-sky-400" size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                PreStake Analyst
              </span>
              <span className="ml-2 text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                1 PRE ≈ ${prePrice.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Keyword Staking Intelligence</h1>
          <p className="text-slate-400">
            Identify high-value SEO keywords with low Presearch competition.
          </p>
        </div>

        {/* Controls Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Main Input */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                 <Search size={18} className="text-sky-400"/>
                 Analyze Niche
               </h2>
               <div className="flex bg-slate-800 rounded-lg p-1">
                 <button 
                   onClick={() => setMode(AnalysisSource.AI_GENERATED)}
                   className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === AnalysisSource.AI_GENERATED ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                   AI Generator
                 </button>
                 <button 
                   onClick={() => setMode(AnalysisSource.CSV_IMPORT)}
                   className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === AnalysisSource.CSV_IMPORT ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                   CSV Import
                 </button>
               </div>
            </div>

            <div className="flex gap-3">
              {mode === AnalysisSource.AI_GENERATED ? (
                <>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Enter a niche (e.g., 'DeFi Protocols', 'Vegan Sneakers')..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2 min-w-[140px] justify-center"
                  >
                    {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <span className="flex items-center gap-2"><Search size={18} /> Analyze</span>}
                  </button>
                </>
              ) : (
                <div className="flex-1 border-2 border-dashed border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition-colors relative">
                   <input 
                      type="file" 
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   />
                   <Upload size={32} className="text-slate-500 mb-2" />
                   <p className="text-sm font-medium text-slate-300">Click to upload Ahrefs/Semrush CSV</p>
                   <p className="text-xs text-slate-500 mt-1">We'll identify the best staking opportunities automatically.</p>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-900/50 rounded-lg flex items-center gap-2 text-red-300 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>

          {/* KPI Cards */}
          <div className="space-y-4">
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-sm font-medium text-slate-400 uppercase mb-1 w-fit">
                    <Tooltip content="The single keyword with the highest calculated Opportunity Score based on search volume, cost-per-click, and difficulty." align="left">
                        <span className="border-b border-dotted border-slate-500 cursor-help flex items-center gap-1">
                           Top Opportunity <Info size={12} />
                        </span>
                    </Tooltip>
                </h3>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-white">
                    {data.length > 0 ? data.reduce((prev, current) => (prev.opportunityScore > current.opportunityScore) ? prev : current).keyword : '-'}
                  </span>
                  {data.length > 0 && (
                    <span className="text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded text-xs">
                      {data.reduce((prev, current) => (prev.opportunityScore > current.opportunityScore) ? prev : current).opportunityScore} Score
                    </span>
                  )}
                </div>
             </div>
             
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-sm font-medium text-slate-400 uppercase mb-1 w-fit">
                    <Tooltip content="The total aggregated monthly search volume of all keywords in this analysis batch." align="left">
                        <span className="border-b border-dotted border-slate-500 cursor-help flex items-center gap-1">
                           Total Volume Analyzed <Info size={12} />
                        </span>
                    </Tooltip>
                </h3>
                <div className="flex justify-between items-end">
                   <span className="text-2xl font-bold text-white">
                     {data.length > 0 ? data.reduce((sum, item) => sum + item.searchVolume, 0).toLocaleString() : '-'}
                   </span>
                   <BarChart2 className="text-slate-600" />
                </div>
             </div>
          </div>
        </div>

        {/* Results Section */}
        {data.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            <StatsChart data={data} />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Keyword Opportunities</h2>
              <span className="text-sm text-slate-500">{data.length} keywords found</span>
            </div>
            <KeywordTable data={data} prePrice={prePrice} />
          </div>
        )}

        {data.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
            <div className="inline-block p-4 rounded-full bg-slate-800 mb-4">
               <Coins size={32} className="text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Ready to Stake?</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Enter a niche above or upload your keyword data to find the most profitable Presearch staking opportunities instantly.
            </p>
          </div>
        )}

      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
};

export default App;