import React from 'react';
import Workspace from '@/components/mixer/Workspace';

export default async function InsightMixerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: _id } = await params;

  return (
    <Workspace />
  );
}
