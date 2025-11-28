/**
 * Zercode Whiteboard Page
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import { ZercodeWhiteboardShell } from '../../whiteboard/shell/ZercodeWhiteboardShell';
import '../../whiteboard/styles/whiteboard.css';

export function WhiteboardPage() {
  const { id } = useParams<{ id?: string }>();

  return (
    <div className="h-screen w-full">
      <ZercodeWhiteboardShell 
        documentId={id}
        initialMode="board"
      />
    </div>
  );
}

