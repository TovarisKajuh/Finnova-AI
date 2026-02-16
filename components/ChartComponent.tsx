import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  { time: '10:00', price: 172 },
  { time: '10:05', price: 173 },
  { time: '10:10', price: 172.5 },
  { time: '10:15', price: 174 },
  { time: '10:20', price: 173.8 },
  { time: '10:25', price: 175 },
  { time: '10:30', price: 174.5 },
  { time: '10:35', price: 176 },
  { time: '10:40', price: 175.5 },
  { time: '10:45', price: 177 },
];

export const ChartComponent: React.FC<{ symbol: string; color: string }> = ({ symbol, color }) => {
  return (
    <div className="w-full h-48 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ display: 'none' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#color${symbol})`} 
            strokeWidth={2}
          />
          <ReferenceLine y={174} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Resistance", fill: '#ef4444', fontSize: 10, position: 'insideBottomRight' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
