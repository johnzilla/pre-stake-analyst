import React, { useState, useMemo } from 'react';
import { KeywordOpportunity } from '../types';
import { ExternalLink, TrendingUp, Info, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import Tooltip from './Tooltip';

interface KeywordTableProps {
  data: KeywordOpportunity[];
  prePrice: number;
}

type SortKey = keyof KeywordOpportunity;

const KeywordTable: React.FC<KeywordTableProps> = ({ data, prePrice }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      // Handle undefined values
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);
  
  const getDifficultyContext = (diff: number) => {
    if (diff > 70) return "Hard to rank. Requires significant staking.";
    if (diff > 40) return "Moderate competition. achievable with consistent staking.";
    return "Low competition. Great opportunity for easy ranking.";
  };

  const getScoreContext = (score: number) => {
    if (score > 80) return "Excellent Opportunity! High volume, low competition.";
    if (score > 50) return "Good potential, but verify competition levels.";
    return "Low opportunity. Likely high effort for low return.";
  };

  // Helper to render the sort icon
  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === 'asc' 
        ? <ArrowUp size={14} className="text-sky-400 ml-1" /> 
        : <ArrowDown size={14} className="text-sky-400 ml-1" />;
    }
    return <ArrowUpDown size={14} className="text-slate-600 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />;
  };

  return (
    <div className="overflow-visible bg-slate-900/50 rounded-xl border border-slate-700/50 shadow-xl pb-10">
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-800/80 text-xs uppercase font-medium text-slate-300">
            <tr>
              <th 
                className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors select-none"
                onClick={() => handleSort('keyword')}
              >
                <div className="flex items-center">
                  <Tooltip content="The specific search term users enter. High intent keywords drive better traffic." align="left">
                    <span className="border-b border-dotted border-slate-500">Keyword</span>
                    <Info size={12} className="text-slate-500 inline ml-1" />
                  </Tooltip>
                  <SortIcon columnKey="keyword" />
                </div>
              </th>
              
              <th 
                className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors select-none"
                onClick={() => handleSort('opportunityScore')}
              >
                <div className="flex justify-center items-center">
                  <Tooltip content="Proprietary score (0-100) combining Volume, CPC, and low Competition. Higher is better.">
                    <span className="border-b border-dotted border-slate-500">Score</span>
                  </Tooltip>
                  <SortIcon columnKey="opportunityScore" />
                </div>
              </th>

              <th 
                className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors select-none"
                onClick={() => handleSort('searchVolume')}
              >
                <div className="flex justify-end items-center">
                  <SortIcon columnKey="searchVolume" />
                  <Tooltip content="Estimated monthly searches. Higher volume means more potential traffic." align="right">
                    <span className="border-b border-dotted border-slate-500">Volume</span>
                  </Tooltip>
                </div>
              </th>

              <th 
                className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors select-none"
                onClick={() => handleSort('cpc')}
              >
                <div className="flex justify-end items-center">
                   <SortIcon columnKey="cpc" />
                   <Tooltip content="Cost Per Click ($). Indicates commercial intent. Advertisers pay this much for ads." align="right">
                    <span className="border-b border-dotted border-slate-500">CPC</span>
                  </Tooltip>
                </div>
              </th>

              <th 
                className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors select-none"
                onClick={() => handleSort('cpc')} // Sorts by CPC underlying value
              >
                <div className="flex justify-end items-center">
                   <SortIcon columnKey="cpc" />
                   <Tooltip content="Cost Per Click converted to PRE tokens based on current market price." align="right">
                    <span className="border-b border-dotted border-slate-500">CPC (PRE)</span>
                  </Tooltip>
                </div>
              </th>

              <th 
                className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors select-none"
                onClick={() => handleSort('keywordDifficulty')}
              >
                <div className="flex justify-end items-center">
                   <SortIcon columnKey="keywordDifficulty" />
                   <Tooltip content="SEO Difficulty (0-100). Higher numbers mean it's harder to rank organically." align="right">
                    <span className="border-b border-dotted border-slate-500">Difficulty</span>
                  </Tooltip>
                </div>
              </th>

              <th 
                className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors select-none"
                onClick={() => handleSort('currentPreStaked')}
              >
                <div className="flex justify-center items-center">
                   <Tooltip content="Total PRE tokens currently staked on this keyword. You must beat the top staker to rank #1.">
                    <span className="border-b border-dotted border-slate-500">Staked PRE</span>
                  </Tooltip>
                  <SortIcon columnKey="currentPreStaked" />
                </div>
              </th>

              <th 
                className="px-6 py-4 cursor-pointer group hover:bg-slate-800 transition-colors select-none"
                onClick={() => handleSort('currentPreStaked')} // Sorts by Staked PRE underlying value
              >
                <div className="flex justify-end items-center">
                   <SortIcon columnKey="currentPreStaked" />
                   <Tooltip content="The current USD value of the total PRE staked on this keyword." align="right">
                    <span className="border-b border-dotted border-slate-500">Stake Value ($)</span>
                  </Tooltip>
                </div>
              </th>

              <th className="px-6 py-4 text-right">
                 <Tooltip content="Direct link to the Presearch staking dashboard for this keyword." align="right">
                    <span className="border-b border-dotted border-slate-500">Action</span>
                  </Tooltip>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedData.map((item, index) => {
              // Adjust tooltip position for the last few rows to avoid clipping
              const isLastRows = index > sortedData.length - 4;
              const rowTooltipPos = isLastRows ? 'top' : 'bottom';
              
              const cpcInPre = prePrice > 0 ? (item.cpc / prePrice) : 0;
              const stakeValueUsd = item.currentPreStaked * prePrice;

              return (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group/row">
                  <td className="px-6 py-4 font-medium text-white">
                    <Tooltip content={`Status: ${item.isAvailable ? 'Available' : 'Taken'}. ${item.isAvailable ? 'This keyword has low competition.' : 'Already heavily staked by others.'}`} align="left" position={rowTooltipPos}>
                      <div className="flex items-center gap-2">
                        {item.keyword}
                        {item.isAvailable ? (
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">Available</span>
                        ) : (
                            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">Taken</span>
                        )}
                      </div>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <Tooltip content={getScoreContext(item.opportunityScore)} position={rowTooltipPos}>
                        <div className="flex items-center gap-1 font-bold text-sky-400 cursor-help">
                          <TrendingUp size={14} />
                          {item.opportunityScore}
                        </div>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <span title="Monthly Search Volume">{item.searchVolume.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-400 font-mono">
                     <span title="Estimated Cost Per Click">${item.cpc.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-blue-400 font-mono">
                     <Tooltip content={`Based on PRE price: $${prePrice.toFixed(4)}`} align="right" position={rowTooltipPos}>
                       <span>{cpcInPre.toLocaleString(undefined, { maximumFractionDigits: 0 })} PRE</span>
                     </Tooltip>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <Tooltip content={getDifficultyContext(item.keywordDifficulty)} align="right" position={rowTooltipPos}>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          item.keywordDifficulty > 70 ? 'bg-red-500/20 text-red-400' :
                          item.keywordDifficulty > 40 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {item.keywordDifficulty}
                        </span>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <Tooltip content={`Top staker: ${item.topStaker || 'None'}. Beat ${item.currentPreStaked.toLocaleString()} PRE to win.`} position={rowTooltipPos}>
                        <div className="flex flex-col items-center cursor-help">
                          <span className="font-bold text-slate-200">{item.currentPreStaked.toLocaleString()} PRE</span>
                          {item.topStaker && <span className="text-[10px] text-slate-500">by {item.topStaker}</span>}
                        </div>
                      </Tooltip>
                    </div>
                  </td>
                   <td className="px-6 py-4 text-right text-slate-300 font-mono">
                     <Tooltip content={`Current market value of the staked PRE tokens.`} align="right" position={rowTooltipPos}>
                       <span>${stakeValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                     </Tooltip>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a 
                      href={`https://keywords.presearch.com/stake?keyword=${encodeURIComponent(item.keyword)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-blue-500/20"
                      title="Open in Presearch"
                    >
                      Stake
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordTable;