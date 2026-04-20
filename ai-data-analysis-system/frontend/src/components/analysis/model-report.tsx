"use client";

import { Trophy, Target, Layers, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface ModelReportProps {
  bestModelName: string;
  bestAccuracy: number;
  taskType: string;
  metricName: string;
  allModelScores: Record<string, number>;
  targetColumn: string;
  numFeatures: number;
  numSamples: number;
}

export function ModelReport({
  bestModelName,
  bestAccuracy,
  taskType,
  metricName,
  allModelScores,
  targetColumn,
  numFeatures,
  numSamples,
}: ModelReportProps) {
  // Prepare chart data sorted by score descending
  const chartData = Object.entries(allModelScores)
    .map(([name, score]) => ({
      name: name.replace(/ (Classifier|Regressor|\(SVC\)|\(SVR\))/g, ""),
      fullName: name,
      score: Number((score * 100).toFixed(2)),
      isBest: name === bestModelName,
    }))
    .sort((a, b) => b.score - a.score);

  const accuracyPct = (bestAccuracy * 100).toFixed(1);

  return (
    <div className="w-full mt-6 space-y-5 animate-in slide-in-from-bottom-4 fade-in-50 duration-700">
      {/* Header Card */}
      <div className="relative overflow-hidden p-6 rounded-2xl border border-white/5 bg-card/60 backdrop-blur-xl shadow-lg">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-5">
          {/* Trophy icon */}
          <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Trophy className="w-7 h-7 text-amber-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-medium">
              Best Model Selected
            </p>
            <h3 className="text-xl font-bold text-foreground truncate">
              {bestModelName}
            </h3>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {/* Accuracy Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">
                  {accuracyPct}%
                </span>
                <span className="text-xs text-emerald-400/70">
                  {metricName}
                </span>
              </div>

              {/* Task Type Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Target className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary capitalize">
                  {taskType}
                </span>
              </div>

              {/* Target Column */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-blue-400">
                  Target: <b>{targetColumn}</b>
                </span>
              </div>
            </div>
          </div>

          {/* Large accuracy number */}
          <div className="shrink-0 text-right hidden sm:block">
            <p className="text-4xl font-black bg-gradient-to-b from-emerald-300 to-emerald-500 bg-clip-text text-transparent leading-none">
              {accuracyPct}
              <span className="text-lg">%</span>
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
              {metricName}
            </p>
          </div>
        </div>

        {/* Dataset stats */}
        <div className="relative mt-4 pt-4 border-t border-white/5 flex gap-6 text-xs text-muted-foreground">
          <span>
            <b className="text-foreground">{numSamples}</b> samples
          </span>
          <span>
            <b className="text-foreground">{numFeatures}</b> features
          </span>
          <span>
            <b className="text-foreground">{Object.keys(allModelScores).length}</b> models
            compared
          </span>
        </div>
      </div>

      {/* Model Comparison Chart */}
      {chartData.length > 0 && (
        <div className="p-6 rounded-2xl border border-white/5 bg-card/60 backdrop-blur-xl shadow-lg">
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-5 bg-primary rounded-full inline-block" />
            Model Comparison ({metricName})
          </h4>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 4, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="hsl(var(--muted-foreground)/0.1)"
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "rgba(20,20,25,0.92)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, _name: any, props: any) => [
                    `${value}% ${props.payload.isBest ? "🏆 BEST" : ""}`,
                    props.payload.fullName,
                  ]}
                />
                <Bar
                  dataKey="score"
                  radius={[0, 6, 6, 0]}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.isBest
                          ? "url(#bestGradient)"
                          : "hsl(var(--muted-foreground)/0.25)"
                      }
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient
                    id="bestGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
