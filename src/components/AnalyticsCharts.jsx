import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, Calendar } from 'lucide-react';

export default function AnalyticsCharts({ projects }) {
  
  // 1. Micromarket Supply vs Demand Data
  const micromarketMap = {};
  projects.forEach(p => {
    const mm = p.micromarket || 'Other';
    if (!micromarketMap[mm]) {
      micromarketMap[mm] = { name: mm, launched: 0, absorbed: 0 };
    }
    micromarketMap[mm].launched += p.launchedUnits;
    micromarketMap[mm].absorbed += p.unitsAbsorbed;
  });

  const supplyDemandData = Object.values(micromarketMap)
    .sort((a, b) => b.launched - a.launched)
    .slice(0, 8);

  // 2. Sanitary Fittings Brand Penetration Data
  const brandCount = {};
  projects.forEach(p => {
    if (p.sanitaryBrands) {
      const brands = p.sanitaryBrands.split(',').map(b => b.trim());
      brands.forEach(b => {
        if (b && b !== '-') {
          brandCount[b] = (brandCount[b] || 0) + 1;
        }
      });
    }
  });

  const brandData = Object.entries(brandCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#0c8de4', '#10b981', '#a855f7', '#f59e0b', '#ec4899', '#3b82f6', '#64748b'];

  // 3. Segment Price Distribution Data
  const segmentPriceMap = {};
  projects.forEach(p => {
    const seg = p.segment || 'Mid';
    if (!segmentPriceMap[seg]) {
      segmentPriceMap[seg] = { segment: seg, count: 0, totalSqft: 0 };
    }
    segmentPriceMap[seg].count += 1;
    segmentPriceMap[seg].totalSqft += p.launchedSqft;
  });

  const segmentData = Object.values(segmentPriceMap);

  // 4. Completion Year Forecast
  const completionYearMap = {};
  projects.forEach(p => {
    const dateStr = p.completionDate || '';
    const match = dateStr.match(/\d{2,4}/);
    let year = '2025';
    if (match) {
      const y = match[0];
      year = y.length === 2 ? `20${y}` : y;
    }
    completionYearMap[year] = (completionYearMap[year] || 0) + p.launchedUnits;
  });

  const timelineData = Object.entries(completionYearMap)
    .map(([year, units]) => ({ year, units }))
    .sort((a, b) => a.year.localeCompare(b.year));

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-400" /> B2B Market Intelligence & Supply Chain Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven Insights on Lucknow RERA Real Estate Absorption, Supply Volume & Vendor Penetration
          </p>
        </div>
      </div>

      {/* Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Supply vs Demand by Micro-market */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" /> Micro-market Supply vs Sales Demand
            </h3>
            <p className="text-xs text-slate-400">Total Launched Units vs Absorbed Units</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplyDemandData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="launched" name="Launched Units" fill="#0c8de4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absorbed" name="Units Absorbed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sanitary Fitting Brand Penetration */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-400" /> Sanitary Fittings Brand Market Share
            </h3>
            <p className="text-xs text-slate-400">Specification prevalence across developer projects</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {brandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 3: Segment Total Area Volume */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" /> Launched Area by Segment (Sqft)
            </h3>
            <p className="text-xs text-slate-400">Total developed area footprint per segment</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segmentData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="segment" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value) => [`${(value/1000000).toFixed(2)} Million Sqft`, 'Total Sqft']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="totalSqft" name="Total Sqft" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Completion Schedule Timeline */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" /> Completion Delivery Timeline
            </h3>
            <p className="text-xs text-slate-400">Project delivery volume forecast (Units)</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="units" name="Units Scheduled" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
