import React from 'react';
import StrategyConsole from '@/components/mixer/StrategyConsole';
import SequencePlaylist from '@/components/mixer/SequencePlaylist';

export default async function InsightMixerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // We await params to ensure we can access the ID if needed in the future
  const { id: _id } = await params;

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Left Sidebar: Strategy Console */}
      <aside className="w-80 flex-shrink-0 h-full">
        <StrategyConsole />
      </aside>

      {/* Right Main: Sequence Playlist */}
      <main className="flex-1 h-full overflow-hidden">
        <SequencePlaylist />
      </main>
    </div>
  );
}
