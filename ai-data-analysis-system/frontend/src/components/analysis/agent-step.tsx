import { CheckCircle2, Loader2, ShieldCheck, Download, CodeIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AgentStep({ status, agentName, description }: { status: 'loading' | 'done', agentName: string, description: string }) {
  
  const getIcon = () => {
      switch (agentName) {
          case 'Orchestrator': return <Search className="w-4 h-4 text-blue-400" />;
          case 'PrivacyAgent': return <ShieldCheck className="w-4 h-4 text-amber-500" />;
          case 'AnalystAgent': return <CodeIcon className="w-4 h-4 text-purple-500" />;
          case 'VisualizerAgent': return <Download className="w-4 h-4 text-emerald-500" />;
          default: return <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />;
      }
  }

  return (
    <div className={`flex items-center gap-4 p-4 border rounded-xl bg-card/50 backdrop-blur-md text-card-foreground shadow-sm transition-all duration-300 ${status === 'loading' ? 'border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.1)] scale-[1.02]' : 'border-border'}`}>
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 border">
        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{agentName}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {agentName === "PrivacyAgent" && (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 shadow-none border-amber-500/20">
          <ShieldCheck className="w-3 h-3 mr-1" /> {status === 'loading' ? 'Encrypting...' : 'Secured'}
        </Badge>
      )}
      {status === 'done' && agentName !== "PrivacyAgent" && (
        <CheckCircle2 className="w-4 h-4 text-emerald-500/70 flex-shrink-0" />
      )}
    </div>
  )
}
