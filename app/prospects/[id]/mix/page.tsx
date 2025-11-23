import React from 'react';
import WorkspaceClient from '@/components/mixer/WorkspaceClient';

export default async function InsightMixerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: _id } = await params;

  return <WorkspaceClient />;
}
