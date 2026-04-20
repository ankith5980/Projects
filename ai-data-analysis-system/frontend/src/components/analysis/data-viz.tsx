"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

export function DataViz({ config }: { config: any }) {
  if (!config) return null;

  return (
    <div className="w-full shrink-0 min-h-[400px] h-[400px] mt-6 p-6 border rounded-2xl bg-card/60 backdrop-blur-xl shadow-lg border-white/5 transition-all duration-500 hover:shadow-primary/10 hover:border-primary/20 flex flex-col">
      <h3 className="text-xl font-medium mb-6 text-card-foreground flex items-center gap-2 shrink-0">
        <span className="w-2 h-6 bg-primary rounded-full inline-block"></span>
        {config.title || "Data Visualization"}
      </h3>
      <div className="w-full" style={{ height: "300px", minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
            {config.type === 'line_chart' ? (
                <AreaChart data={config.data}>
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.15)" />
                    <XAxis dataKey={config.xKey} tick={{ fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dy={10} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dx={-10} />
                    <RechartsTooltip cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'rgba(20,20,25,0.85)', backdropFilter: 'blur(8px)', color: 'white' }} />
                    <Area type="monotone" dataKey={config.yKey} stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#areaGradient)" animationDuration={1500} />
                </AreaChart>
            ) : (
                <BarChart data={config.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.15)" />
                <XAxis dataKey={config.xKey} tick={{ fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dy={10} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dx={-10} />
                <RechartsTooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.4)' }} 
                    contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid hsl(var(--border))', 
                        backgroundColor: 'rgba(20,20,25,0.85)',
                        backdropFilter: 'blur(8px)',
                        color: 'white',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    }} 
                />
                <Bar 
                    dataKey={config.yKey} 
                    fill="url(#primaryGradient)" 
                    radius={[6, 6, 0, 0]} 
                    animationDuration={1500}
                    animationEasing="ease-out"
                />
                <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    </linearGradient>
                </defs>
                </BarChart>
            )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
