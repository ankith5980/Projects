import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid correctly once.
mermaid.initialize({ 
  startOnLoad: false, 
  theme: 'dark',
  suppressErrorRendering: true 
});

interface MermaidProps {
  content: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ content }) => {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;
    
    const renderChart = async () => {
      try {
        if (!content || content.trim() === "" || content === "undefined") {
          if (!isCancelled) {
            setSvg("");
            setError(false);
          }
          return;
        }

        let cleanContent = content.trim();
        // Fix common LLM syntax hallucinations
        if (/^graph/i.test(cleanContent) && cleanContent.includes('participant')) {
          cleanContent = cleanContent.replace(/^graph(\s+\w+)?/i, 'sequenceDiagram');
        }
        cleanContent = cleanContent.replace(/^Graph/i, 'graph');

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: generatedSvg } = await mermaid.render(id, cleanContent);
        
        // Remove any orphan error SVGs that Mermaid might have inserted globally
        const orphanBomb = document.getElementById(`d${id}`);
        if (orphanBomb) {
          orphanBomb.remove();
        }

        if (!isCancelled) {
          setSvg(generatedSvg);
          setError(false);
        }
      } catch (err) {
        // Find and remove the global error 'bomb' svg element mermaid injects dynamically on failing renders
        const errorBoxes = document.querySelectorAll('[id^="dmermaid-"]');
        errorBoxes.forEach(box => box.remove());

        // Ignore parsing errors during streaming, but show error UI safely
        if (!isCancelled) {
          setError(true);
        }
      }
    };

    // Debounce rendering when content is rapidly streaming character by character
    const timer = setTimeout(() => {
      renderChart();
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [content]);

  if (!svg || error) {
    return (
      <div className="my-6 relative group">
        <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider text-muted-foreground bg-black/40 px-2 py-1 rounded">
          {error ? "Failing to render" : "Rendering..."}
        </div>
        <pre className="p-4 bg-black/20 rounded-lg overflow-auto text-sm font-mono text-zinc-300 border border-white/5">
          <code>{content}</code>
        </pre>
      </div>
    );
  }

  return (
    <div 
      className="mermaid-chart flex justify-center my-6 text-white bg-black/20 p-6 rounded-xl border border-white/5 overflow-x-auto" 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};