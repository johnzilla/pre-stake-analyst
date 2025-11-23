import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { KeywordOpportunity } from '../types';
import Tooltip from './Tooltip';
import { Info } from 'lucide-react';

interface StatsChartProps {
  data: KeywordOpportunity[];
}

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    x: item.keywordDifficulty,
    y: item.searchVolume,
    z: item.cpc,
    name: item.keyword,
    score: item.opportunityScore
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-slate-800 p-3 border border-slate-700 rounded shadow-lg text-xs">
          <p className="font-bold text-sky-400 mb-1">{p.name}</p>
          <p className="text-slate-300">Difficulty: {p.x}</p>
          <p className="text-slate-300">Volume: {p.y.toLocaleString()}</p>
          <p className="text-slate-300">CPC: ${p.z.toFixed(2)}</p>
          <p className="text-green-400 font-bold">Score: {p.score}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2 w-fit">
        <Tooltip content="A visual representation of keyword value. Ideally, you want keywords in the top-left (High Volume, Low Difficulty) with large bubbles (High CPC)." align="left">
            <span className="border-b border-dotted border-slate-500 cursor-help flex items-center gap-2">
                Opportunity Matrix
                <Info size={16} className="text-slate-500" />
            </span>
        </Tooltip>
        <span className="text-xs font-normal text-slate-500 ml-2">(X: Difficulty, Y: Volume, Size: CPC)</span>
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Difficulty" 
            stroke="#94a3b8" 
            label={{ value: 'Difficulty (0-100)', position: 'insideBottomRight', offset: -10, fill: '#64748b' }} 
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Volume" 
            stroke="#94a3b8" 
            label={{ value: 'Volume', angle: -90, position: 'insideLeft', fill: '#64748b' }}
          />
          <ZAxis type="number" dataKey="z" range={[50, 400]} name="CPC" />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Keywords" data={chartData} fill="#3b82f6" fillOpacity={0.6} stroke="#60a5fa" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;