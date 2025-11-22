'use client';

import React from 'react';
import { DndContext, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { useMixerStore } from '@/store/mixer-store';
import { Plus, FileText, Mail, MessageSquare } from 'lucide-react';

interface StepCardProps {
  step: number;
  title: string;
  icon: React.ReactNode;
}

const StepCard = ({ step, title, icon }: StepCardProps) => {
  return (
    <div className="group relative p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
            {step}
          </div>
          <span className="text-zinc-200 font-medium">{title}</span>
        </div>
        <div className="text-zinc-600 group-hover:text-zinc-500 transition-colors">
          {icon}
        </div>
      </div>
      
      <div className="h-24 rounded-lg border border-dashed border-zinc-800 bg-zinc-950/50 flex items-center justify-center gap-2 text-zinc-600 text-sm">
        <Plus className="w-4 h-4" />
        <span>Drop strategy here</span>
      </div>
    </div>
  );
};

export default function SequencePlaylist() {
  const { setIsDragging } = useMixerStore();
  const { setNodeRef } = useDroppable({
    id: 'playlist-droppable',
  });

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    // Logic for handling drop will go here later
    console.log('Dropped:', event);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-full p-8 overflow-y-auto" ref={setNodeRef}>
        <div className="max-w-3xl mx-auto">
          <header className="mb-12">
            <h1 className="text-2xl font-bold text-zinc-100 mb-2">Sequence Playlist</h1>
            <p className="text-zinc-500">Drag strategies to build your outreach sequence.</p>
          </header>

          <div className="space-y-6">
            <StepCard 
              step={1} 
              title="The Hook" 
              icon={<MessageSquare className="w-5 h-5" />} 
            />
            <StepCard 
              step={2} 
              title="The Problem" 
              icon={<FileText className="w-5 h-5" />} 
            />
            <StepCard 
              step={3} 
              title="The Solution" 
              icon={<Mail className="w-5 h-5" />} 
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
