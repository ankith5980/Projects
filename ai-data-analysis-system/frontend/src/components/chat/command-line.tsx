"use client"

import { useState, useRef } from "react"
import { ArrowRight, Loader2, Paperclip } from "lucide-react"

export function CommandLine({ onSubmit, isProcessing }: { onSubmit: (task: string, filePath?: string) => void, isProcessing: boolean }) {
  const [task, setTask] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task.trim() || isProcessing || isUploading) return;

    let serverFilePath = undefined;

    if (file) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        serverFilePath = data.path
      } catch (error) {
        console.error("Upload failed", error)
        alert("Failed to upload file")
        setIsUploading(false)
        return
      }
      setIsUploading(false)
      setFile(null)
    }

    onSubmit(task, serverFilePath)
    setTask("")
  }

  return (
    <form onSubmit={handleSubmit} className="relative group w-full flex flex-col gap-2">
      {file && (
        <div className="text-xs flex justify-between items-center bg-blue-500/10 text-blue-400 px-3 py-2 rounded-lg border border-blue-500/20 transition-all w-fit max-w-full backdrop-blur-md">
          <span className="truncate mr-4">Attachment: <b className="font-medium">{file.name}</b></span>
          <button type="button" onClick={() => setFile(null)} className="hover:text-red-400 transition-colors shrink-0 font-medium">Remove</button>
        </div>
      )}

      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative flex items-center p-1 bg-card rounded-xl border border-white/10 shadow-inner">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.xlsx"
            className="hidden"
          />
        <button 
          type="button"
          disabled={isProcessing || isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input 
          type="text" 
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={isProcessing || isUploading}
          placeholder="E.g. Analyze transaction volumes..."
          className="w-full bg-transparent border-none text-sm px-2 py-3 focus:outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={!task.trim() || isProcessing || isUploading}
          className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground w-10 h-10 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:scale-100 hover:scale-105 active:scale-95 mx-1"
        >
          {(isProcessing || isUploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
     </div>
    </form>
  )
}
