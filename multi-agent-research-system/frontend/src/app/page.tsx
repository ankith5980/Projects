"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Brain, Database, PenTool, Send, CheckCircle2, AlertCircle, Folder, Upload, ArrowRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Mermaid } from '@/components/Mermaid';

export default function Home() {
  const [ingestPath, setIngestPath] = useState("");
  const [ingestStatus, setIngestStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [ingestMessage, setIngestMessage] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [updates, setUpdates] = useState<{ id: number; node: string; message: string }[]>([]);
  const [report, setReport] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollTop = container.scrollHeight;
    }
  }, [updates]);

  useEffect(() => {
    if (report && reportRef.current) {
        // Give the DOM a tiny bit of time to layout the markdown before scrolling
        setTimeout(() => {
            reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [report]);

  const handleBrowse = async () => {
      try {
          const res = await fetch("http://localhost:8000/api/browse");
          const data = await res.json();
          if (data.path) {
              setIngestPath(data.path);
          }
      } catch (err) {
          console.error("Failed to browse", err);
      }
  };

  const handleIngest = async () => {
      if (!ingestPath.trim()) return;
      setIngestStatus("running");
      setIngestMessage(null);
      try {
          const res = await fetch("http://localhost:8000/api/ingest", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ folder_path: ingestPath })
          });
          const data = await res.json();
          if (data.status === "success") {
              setIngestStatus("done");
              setIngestMessage("Database successfully initialized!");
          } else {
              setIngestStatus("error");
              setIngestMessage(data.message || "Failed to ingest the folder.");
          }
      } catch (err) {
          setIngestStatus("error");
          setIngestMessage("Failed to connect to the backend API.");
      }
  };

  const handleNewResearch = () => {
    setStatus("idle");
    setQuery("");
    setUpdates([]);
    setReport(null);
  };

  const handleStartResearch = () => {
    if (!query.trim()) return;
    setStatus("running");
    setUpdates([]);
    setReport(null);

    const eventSource = new EventSource(`http://localhost:8000/api/research/stream?query=${encodeURIComponent(query)}`);

    let idSequence = 0;
    const addUpdate = (node: string, message: string) => {
        setUpdates(prev => [...prev, { id: idSequence++, node, message }]);
    };

    eventSource.addEventListener("start", (ev: any) => {
        const data = JSON.parse(ev.data);
        addUpdate("system", data.message);
    });

    eventSource.addEventListener("update", (ev: any) => {
        const data = JSON.parse(ev.data);
        addUpdate(data.node, data.message);
    });

    eventSource.addEventListener("complete", (ev: any) => {
        const data = JSON.parse(ev.data);
        setReport(data.report);
    });

    eventSource.addEventListener("done", () => {
        setStatus("done");
        eventSource.close();
    });

    eventSource.addEventListener("error", (ev: any) => {
        let msg = "Connection error";
        try { if(ev.data) msg = JSON.parse(ev.data).message; } catch(e) {}
        addUpdate("error", msg);
        setStatus("error");
        eventSource.close();
    });
  };

  const getIconForNode = (node: string) => {
      switch (node) {
          case 'planner': return <Brain className="w-5 h-5 text-purple-400" />;
          case 'researcher': return <Database className="w-5 h-5 text-blue-400" />;
          case 'writer': return <PenTool className="w-5 h-5 text-pink-400" />;
          case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
          default: return <Sparkles className="w-5 h-5 text-zinc-400" />;
      }
  };

  return (
    <main className="min-h-screen p-8 relative overflow-x-hidden flex flex-col items-center">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl z-10 flex flex-col gap-8 mt-12 mb-20">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Autonomous <span className="gradient-text">Research</span> Engine
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Orchestrated by open-source LLMs. Feed your data, define your topic, and watch the agents collaborate in real-time.
          </p>
        </motion.div>

        {/* Configuration / Ingest Stage */}
        <AnimatePresence mode="wait">
            {ingestStatus !== "done" && (
                <motion.div 
                    key="ingest-stage"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="glass-panel rounded-2xl p-6 shadow-2xl relative z-20 flex flex-col gap-4 border border-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold tracking-wide">Step 1: Link Knowledge Base</h2>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Enter the absolute path to your local folder containing your PDF or TXT documents. The system will vectorize them for the Researcher Agent.
                    </p>
                    
                    <div className="flex bg-black/40 rounded-xl p-2 items-center border border-white/5">
                        <Folder className="w-5 h-5 text-muted-foreground ml-3" />
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-white placeholder:text-muted-foreground/50 font-mono text-sm"
                            placeholder="C:\Users\John\Documents\Research Papers"
                            value={ingestPath}
                            onChange={(e) => setIngestPath(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleIngest()}
                            disabled={ingestStatus === "running"}
                        />
                        <button
                            onClick={handleBrowse}
                            disabled={ingestStatus === "running"}
                            className="bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 mr-2 text-sm"
                        >
                            Browse
                        </button>
                        <button 
                            onClick={handleIngest}
                            disabled={ingestStatus === "running" || !ingestPath.trim()}
                            className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                        >
                            {ingestStatus === "running" ? (
                                <> <span className="animate-spin">⍥</span> Ingesting </>
                            ) : (
                                <> <Upload className="w-4 h-4"/> Index </>
                            )}
                        </button>
                    </div>

                    {ingestMessage && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={`p-4 rounded-lg mt-2 flex items-center gap-3 text-sm ${ingestStatus === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}
                        >
                            {ingestStatus === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                            {ingestMessage}
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Research Stage */}
        <AnimatePresence>
            {ingestStatus === "done" && (
                <motion.div 
                    key="research-stage"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="glass-panel flex items-center justify-between p-4 px-6 rounded-2xl mb-8 border border-green-500/20 bg-green-500/5">
                         <div className="flex items-center gap-3">
                             <CheckCircle2 className="w-5 h-5 text-green-400" />
                             <div>
                                 <p className="font-medium text-green-100">Knowledge Base Active</p>
                                 <p className="text-xs text-green-400/80 mt-0.5 font-mono">{ingestPath}</p>
                             </div>
                         </div>
                         <button 
                            onClick={() => setIngestStatus("idle")} 
                            className="text-xs text-zinc-400 hover:text-white transition-colors"
                         >
                             Change Folder
                         </button>
                    </div>

                    <div className="glass-panel rounded-2xl p-2 flex items-center shadow-2xl relative z-20 border-white/10">
                        <Search className="w-6 h-6 text-muted-foreground ml-4" />
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-none outline-none text-lg px-4 py-3 placeholder:text-muted-foreground/50 text-white"
                            placeholder="Ask the agents a research question..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && status !== 'running' && handleStartResearch()}
                            disabled={status === "running"}
                        />
                        {status === "done" || status === "error" ? (
                            <button 
                                onClick={handleNewResearch}
                                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                <ArrowRight className="w-4 h-4"/> New Research
                            </button>
                        ) : (
                            <button 
                                onClick={handleStartResearch}
                                disabled={status === "running" || !query.trim()}
                                className="bg-white text-black px-6 py-3 rounded-xl font-medium tracking-wide hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {status === "running" ? (
                                    <> <span className="animate-spin text-xl">⍥</span> Researching </>
                                ) : (
                                    <> <Send className="w-4 h-4"/> Start </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Live Status Stream */}
        <AnimatePresence>
            {updates.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-panel rounded-2xl p-6 border border-white/5"
                >
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-semibold flex items-center gap-2">
                        <span>Agent Intercommunications</span>
                        {status === "running" && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                    </h3>
                    <div 
                        ref={scrollContainerRef}
                        className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
                    >
                        <AnimatePresence>
                            {updates.map((u) => (
                                <motion.div 
                                    key={u.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-4 p-3 rounded-lg bg-black/20"
                                >
                                    <div className="p-2 rounded-full bg-white/5 backdrop-blur-md">
                                        {getIconForNode(u.node)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase font-semibold">{u.node}</span>
                                        <span className="text-sm leading-relaxed">{u.message}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Final Report */}
        <AnimatePresence>
            {report && (
                 <motion.div 
                 ref={reportRef}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="glass-panel rounded-2xl p-8 shadow-2xl mt-8 mb-10"
             >
                 <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                     <CheckCircle2 className="w-8 h-8 text-green-400" />
                     <h2 className="text-2xl font-bold">Research Report</h2>
                 </div>
                 <div className="prose prose-invert prose-purple max-w-none">
                     <ReactMarkdown
                         components={{
                             code(props: any) {
                                 const { className, children, ...rest } = props;
                                 const match = /language-(\w+)/.exec(className || '');
                                 
                                 if (match && match[1] === 'mermaid') {
                                     const codeContent = Array.isArray(children) ? children.join('') : children || '';
                                     return <Mermaid content={String(codeContent).replace(/\n$/, '')} />;
                                 }
                                 
                                 return (
                                     <code className={className} {...rest}>
                                         {children}
                                     </code>
                                 );
                             }
                         }}
                     >
                         {report}
                     </ReactMarkdown>
                 </div>
                 <div className="mt-10 pt-6 border-t border-white/10 flex justify-center">
                     <button
                         onClick={handleNewResearch}
                         className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2 text-lg"
                     >
                         <ArrowRight className="w-5 h-5" /> New Research
                     </button>
                 </div>
             </motion.div>
            )}
        </AnimatePresence>
      </div>
    </main>
  );
}
