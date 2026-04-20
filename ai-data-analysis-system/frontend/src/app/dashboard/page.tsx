"use client"

import { useState, useRef, useEffect } from "react"
import { CommandLine } from "@/components/chat/command-line"
import { AgentStep } from "@/components/analysis/agent-step"
import { DataViz } from "@/components/analysis/data-viz"
import { ModelReport } from "@/components/analysis/model-report"
import { Sparkles, Activity, ShieldCheck, Database, BrainCircuit, Wrench } from "lucide-react"

type AgentId = "Orchestrator" | "PrivacyAgent" | "CleanerAgent" | "ModelerAgent" | "AnalystAgent" | "VisualizerAgent"

interface LogEvent {
    agent: AgentId;
    status: 'loading' | 'done';
    description: string;
}

interface ModelReportData {
    bestModelName: string;
    bestAccuracy: number;
    taskType: string;
    metricName: string;
    allModelScores: Record<string, number>;
    targetColumn: string;
    numFeatures: number;
    numSamples: number;
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<LogEvent[]>([])
  const [vizConfigs, setVizConfigs] = useState<any[]>([])
  const [conclusion, setConclusion] = useState<string | null>(null)
  const [modelReport, setModelReport] = useState<ModelReportData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  const connectWebSocket = () => {
    if (!wsRef.current) {
      wsRef.current = new WebSocket("ws://localhost:8000/ws")
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.type === "agent_state") {
            setLogs(prev => {
                const newLogs: LogEvent[] = prev.map(log => ({ ...log, status: 'done' }))
                if (!newLogs.find(l => l.agent === data.agent)) {
                    newLogs.push({ agent: data.agent, status: 'loading', description: `Running ${data.agent} logic...` })
                }
                return newLogs
            })
        } else if (data.type === "model_report") {
            setModelReport({
                bestModelName: data.best_model_name,
                bestAccuracy: data.best_accuracy,
                taskType: data.task_type,
                metricName: data.metric_name,
                allModelScores: data.all_model_scores,
                targetColumn: data.target_column,
                numFeatures: data.num_features,
                numSamples: data.num_samples,
            })
        } else if (data.type === "visualization_array") {
            setVizConfigs(data.configs)
        } else if (data.type === "conclusion") {
            setConclusion(data.text)
        } else if (data.type === "done") {
            setLogs(prev => prev.map(log => ({ ...log, status: 'done' as const })))
            setIsProcessing(false)
        }
      }
    }
  }

  useEffect(() => {
    connectWebSocket()
    return () => {
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [])

  const handleTaskSubmit = (task: string, csv_file_path?: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        setIsProcessing(true)
        setLogs([])
        setVizConfigs([])
        setConclusion(null)
        setModelReport(null)
        wsRef.current.send(JSON.stringify({ task, csv_file_path }))
    } else {
        alert("WebSocket not connected. Please ensure backend is running.")
    }
  }

  const hasResults = vizConfigs.length > 0 || modelReport !== null

  return (
    <div className="flex w-full h-screen bg-background text-foreground overflow-hidden">
      {/* Left Panel: Command Center */}
      <div className="w-1/3 min-w-[350px] h-full border-r border-border bg-sidebar/50 backdrop-blur flex flex-col items-start p-6">
        <div className="flex items-center gap-3 mb-10 w-full pb-4 border-b border-border/50 shrink-0">
          <div className="p-2 bg-primary/20 rounded-lg shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI Analyst</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse pb-0.5"></span>
              Orchestrator ready
            </p>
          </div>
        </div>
        
        <div className="flex-1 min-h-0 w-full flex flex-col gap-4 overflow-y-auto pr-2 pb-6">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4 shrink-0">
                <p className="text-sm font-medium mb-2">Capabilities</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5"><Database className="w-3 h-3 text-blue-500" /> Read CSV</div>
                    <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-amber-500" /> Auto Masking</div>
                    <div className="flex items-center gap-1.5"><Wrench className="w-3 h-3 text-cyan-400" /> Data Cleaning</div>
                    <div className="flex items-center gap-1.5"><BrainCircuit className="w-3 h-3 text-rose-400" /> Auto-ML</div>
                    <div className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-emerald-500" /> Live Charts</div>
                </div>
            </div>
            
            {logs.length === 0 && !isProcessing && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 opacity-50 shrink-0 min-h-[200px]">
                    <Sparkles className="w-8 h-8 mb-4 border border-border rounded-full p-1.5 opacity-50" />
                    <p className="text-sm">Submit a natural language request to securely analyze datasets.</p>
                </div>
            )}
            
            {logs.map((log, i) => (
                <AgentStep 
                    key={i}
                    status={log.status}
                    agentName={log.agent}
                    description={log.description}
                />
            ))}
        </div>
        <div className="w-full shrink-0 mt-auto pt-4 border-t border-border/50">
            <CommandLine onSubmit={handleTaskSubmit} isProcessing={isProcessing} />
        </div>
      </div>

      {/* Right Panel: The Dynamic Workspace */}
      <div className="flex-1 flex w-full h-full bg-grid-white/[0.02] bg-[length:30px_30px]">
        <div className="w-full h-full flex items-center justify-center p-12">
            {!hasResults && !isProcessing && (
                <div className="text-center space-y-4 max-w-sm">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center transform hover:scale-105 transition-transform duration-300 ring-1 ring-border shadow-2xl">
                        <Activity className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold opacity-80">Workspace Empty</h2>
                    <p className="text-sm text-muted-foreground">The generated visualization and data tables will appear dynamically as the Analyst agent streams output.</p>
                </div>
            )}
            
            {isProcessing && !hasResults && (
                 <div className="text-center space-y-4 max-w-sm animate-pulse">
                     <p className="text-primary font-medium tracking-widest text-sm uppercase">Evaluating Data</p>
                 </div>
            )}

            {hasResults && (
                <div className="w-full max-w-4xl flex flex-col gap-8 animate-in slide-in-from-bottom-8 fade-in-50 duration-700 mx-auto max-h-[90vh] overflow-y-auto pr-4 pb-12">
                    
                    {/* ML Model Report Card */}
                    {modelReport && (
                        <ModelReport
                            bestModelName={modelReport.bestModelName}
                            bestAccuracy={modelReport.bestAccuracy}
                            taskType={modelReport.taskType}
                            metricName={modelReport.metricName}
                            allModelScores={modelReport.allModelScores}
                            targetColumn={modelReport.targetColumn}
                            numFeatures={modelReport.numFeatures}
                            numSamples={modelReport.numSamples}
                        />
                    )}

                    {/* Visualization Charts */}
                    {vizConfigs.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {vizConfigs.map((cfg, idx) => (
                               <div key={idx} className={idx === 0 ? "col-span-1 md:col-span-2" : "col-span-1"}>
                                   <DataViz config={cfg} />
                               </div>
                            ))}
                        </div>
                    )}

                    {/* Executive Summary */}
                    {conclusion && (
                         <div className="p-6 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 text-sm leading-relaxed shadow-sm">
                             <h3 className="font-semibold text-lg mb-4 text-primary">Auto-ML Executive Summary</h3>
                             <div className="whitespace-pre-wrap font-mono text-xs opacity-90">{conclusion}</div>
                         </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
