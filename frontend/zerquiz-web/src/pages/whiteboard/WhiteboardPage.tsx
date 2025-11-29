/**
 * Whiteboard Page Wrapper
 * Route integration için wrapper component
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import { ZercodeWhiteboardShell } from '../../whiteboard/shell/ZercodeWhiteboardShell';

export function WhiteboardPage() {
  const { documentId } = useParams<{ documentId?: string }>();

  return (
    <div className="h-screen w-full">
      <ZercodeWhiteboardShell documentId={documentId} initialMode="board" />
    </div>
  );
}

