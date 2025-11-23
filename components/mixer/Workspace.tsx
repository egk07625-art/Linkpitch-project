'use client'

import React, { useState } from 'react'
import { 
  DndContext, 
  DragOverlay, 
  useDraggable, 
  useDroppable, 
  DragEndEvent,
  DragStartEvent,
  closestCenter
} from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  ChevronRight, 
  FileText, 
  GripVertical, 
  LayoutTemplate, 
  Mail, 
  Sparkles
} from 'lucide-react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// --- Mock Data Types ---
type VisionItem = {
  id: string
  label: string
  content: string
  type: 'text' | 'image'
}

const INITIAL_VISION_DATA: VisionItem[] = [
  { id: 'v1', label: 'Mood', content: 'Luxury, Minimalist, High-end fashion', type: 'text' },
  { id: 'v2', label: 'Visual USP', content: 'Extreme close-up textures with high contrast lighting.', type: 'text' },
  { id: 'v3', label: 'Key Object', content: 'Gold plated perfume bottle', type: 'text' },
  { id: 'v4', label: 'Performance Graph', content: 'ROAS +280% (Image Asset)', type: 'image' },
]

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<'email' | 'report'>('email')
  const [visionItems, setVisionItems] = useState(INITIAL_VISION_DATA)
  const [editorContent, setEditorContent] = useState('')
  const [draggedItem, setDraggedItem] = useState<VisionItem | null>(null)

  // --- DnD Handlers ---
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const item = visionItems.find(i => i.id === active.id)
    if (item) setDraggedItem(item)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event
    if (over && over.id === 'editor-drop-zone' && draggedItem) {
      // Simulate inserting content into editor
      const newContent = `\n[Inserted Strategy: ${draggedItem.content}]\n`
      setEditorContent((prev) => prev + newContent)
    }
    setDraggedItem(null)
  }

  // --- Inline Edit Handler for Left Pane ---
  const updateVisionItem = (id: string, newContent: string) => {
    setVisionItems(prev => prev.map(item => 
      item.id === id ? { ...item, content: newContent } : item
    ))
  }

  return (
    <DndContext 
      id="workspace-dnd-context"
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      {/* 
        [Global Layout] 
        h-screen & overflow-hidden ensures NO global scrollbar. 
        Everything lives inside this fixed container.
      */}
      <div className="h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-500/30">
        
        {/* 1. Header: Minimalist & Functional */}
        <Header />

        {/* 2. Main Workspace: Split View */}
        <div className="flex-1 overflow-hidden relative">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            
            {/* === LEFT PANE: Context Hub === */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={45} className="bg-zinc-900/30 backdrop-blur-sm z-10">
              <div className="h-full flex flex-col border-r border-zinc-800/50">
                
                {/* Pane Header */}
                <div className="px-5 py-4 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/50">
                  <div className="flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-200">Context Hub</span>
                  </div>
                  <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400 font-mono">
                    AI READY
                  </Badge>
                </div>

                {/* Scrollable Area for Assets */}
                <ScrollArea className="flex-1 px-5 py-6">
                  <div className="space-y-8">
                    {/* Section: Vision Analysis */}
                    <section>
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 pl-1">
                        Vision Intelligence
                      </h3>
                      <div className="space-y-3">
                        {visionItems.map((item) => (
                          <DraggableStrategyChip 
                            key={item.id} 
                            item={item} 
                            onUpdate={updateVisionItem} 
                          />
                        ))}
                      </div>
                    </section>

                    {/* Section: User Assets */}
                    <section>
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 pl-1">
                        My Uploads
                      </h3>
                      <div className="h-32 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500 hover:border-zinc-600 hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                        <FileText className="w-6 h-6 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs">Drop files or click to upload</span>
                      </div>
                    </section>
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-[1px] bg-zinc-800 hover:bg-blue-500 transition-colors" />

            {/* === RIGHT PANE: Editor Canvas === */}
            <ResizablePanel defaultSize={65}>
              <div className="h-full flex flex-col bg-zinc-950 relative">
                
                {/* Tab Switcher (Floating feel) */}
                <div className="flex justify-center pt-6 pb-2 z-20">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-[320px]">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-900/80 border border-zinc-800/50 backdrop-blur-xl h-10 p-1 rounded-lg">
                      <TabsTrigger value="email" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition-all">
                        <Mail className="w-3 h-3 mr-2" /> Teaser (Email)
                      </TabsTrigger>
                      <TabsTrigger value="report" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition-all">
                        <FileText className="w-3 h-3 mr-2" /> Main (Report)
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* The Editor Canvas */}
                <ScrollArea className="flex-1 w-full">
                  <DroppableEditor 
                    activeTab={activeTab} 
                    content={editorContent} 
                    setContent={setEditorContent} 
                  />
                </ScrollArea>

                {/* Floating AI Command Bar (Spotlight Style) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[600px] max-w-[90%] z-50">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
                    <div className="relative bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-xl shadow-2xl flex items-center p-1.5 pl-4 overflow-hidden">
                      <Bot className="w-5 h-5 text-indigo-400 mr-3 animate-pulse" />
                      <input 
                        type="text" 
                        placeholder="Ask AI to refine logic or change tone..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-500 h-10"
                      />
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white rounded-lg">
                          <Sparkles className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="h-8 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium">
                          Run
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Drag Overlay (Visual feedback when dragging) */}
      <DragOverlay>
        {draggedItem ? (
          <div className="bg-zinc-800/90 backdrop-blur-md border border-indigo-500/50 text-white px-4 py-3 rounded-lg shadow-2xl w-64 cursor-grabbing flex items-center gap-3">
             <GripVertical className="w-4 h-4 text-zinc-500" />
             <div>
               <p className="text-[10px] font-bold text-indigo-400 uppercase">{draggedItem.label}</p>
               <p className="text-xs truncate text-zinc-300">{draggedItem.content}</p>
             </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

// ------------------------------------------------------------------
// Sub-Components (Modular for Cleanliness)
// ------------------------------------------------------------------

/**
 * 1. Header Component
 */
function Header() {
  return (
    <header className="h-14 flex-none border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
        <Separator orientation="vertical" className="h-4 bg-zinc-800" />
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-zinc-200 tracking-tight">GlowUp Campaign #1</h1>
          <span className="text-[10px] text-zinc-500 font-mono">Last saved 2m ago</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-8">
          Save Draft
        </Button>
        <Button size="sm" className="bg-white text-black hover:bg-zinc-200 h-8 px-4 font-medium rounded-full">
          Export Sequence <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </header>
  )
}

/**
 * 2. Draggable Strategy Chip (Left Pane Item)
 * Features: Inline Edit + Drag Handle
 */
function DraggableStrategyChip({ item, onUpdate }: { item: VisionItem, onUpdate: (id: string, val: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: item.id })
  const [isEditing, setIsEditing] = useState(false)

  // Style for dragging state
  const style = isDragging ? { opacity: 0.3 } : undefined

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "group relative bg-zinc-900 border border-zinc-800 rounded-xl p-3 transition-all duration-200 hover:border-zinc-600 hover:shadow-lg hover:shadow-black/20",
        isEditing ? "ring-1 ring-blue-500 border-blue-500/50" : ""
      )}
    >
      {/* Label & Drag Handle */}
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-wider">{item.label}</span>
        {/* Only drag via handle to allow text selection/editing */}
        <div {...listeners} {...attributes} className="cursor-grab hover:text-white text-zinc-600 p-1 -mr-2 -mt-2 rounded active:cursor-grabbing">
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Editable Content */}
      {isEditing ? (
        <textarea
          autoFocus
          className="w-full bg-black/30 text-xs text-zinc-200 p-1 rounded border border-blue-500/30 outline-none resize-none"
          rows={2}
          value={item.content}
          onChange={(e) => onUpdate(item.id, e.target.value)}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <p 
          onClick={() => setIsEditing(true)}
          className="text-sm text-zinc-300 leading-snug cursor-text hover:bg-white/5 rounded px-1 -mx-1 transition-colors"
        >
          {item.content}
        </p>
      )}
      
      {/* Edit Hint */}
      {!isEditing && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-[9px] text-zinc-500">Click to edit</span>
        </div>
      )}
    </div>
  )
}

/**
 * 3. Droppable Editor (Right Pane Content)
 * Features: Drop Zone feedback + Tab Animation
 */
function DroppableEditor({ activeTab, content, setContent }: { activeTab: 'email' | 'report', content: string, setContent: any }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'editor-drop-zone' })

  return (
    <div className="px-12 py-8 min-h-[800px] flex justify-center pb-32">
      <div 
        ref={setNodeRef}
        className={cn(
          "w-full max-w-3xl transition-all duration-300 rounded-xl border border-transparent p-1",
          isOver ? "bg-indigo-500/10 border-indigo-500/30 scale-[1.01]" : ""
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* The "Paper" Area */}
            <div className="min-h-[600px] text-zinc-100 p-8 md:p-12 bg-transparent outline-none">
              
              {activeTab === 'email' && (
                 <div className="mb-8 space-y-2 border-b border-zinc-800 pb-6">
                    <label className="text-xs font-semibold text-zinc-500 uppercase">Subject</label>
                    <input 
                      className="w-full bg-transparent text-2xl font-semibold text-white placeholder:text-zinc-700 outline-none"
                      placeholder="Enter an engaging subject line..."
                      defaultValue="Re: Quick question about your recent launch"
                    />
                 </div>
              )}

              <div 
                className="prose prose-invert max-w-none text-lg leading-relaxed text-zinc-300/90 whitespace-pre-wrap outline-none empty:before:content-['Drag_chips_here_or_start_typing...'] empty:before:text-zinc-700"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setContent(e.currentTarget.textContent)}
              >
                {content || (
                  activeTab === 'email' 
                  ? "Hi [Name],\n\nI recently came across your brand and was impressed by...\n\n"
                  : "# Visual Analysis Report\n\nBased on our AI analysis, your current visual assets are performing well in..."
                )}
              </div>

              {/* Visual Cue for Drop */}
              {isOver && (
                <div className="mt-4 h-24 border-2 border-dashed border-indigo-500/50 rounded-xl bg-indigo-500/5 flex items-center justify-center animate-pulse">
                  <span className="text-indigo-400 font-medium text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Insert Strategy Here
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
