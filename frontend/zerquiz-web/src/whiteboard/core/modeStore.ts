/**
 * Zercode Whiteboard Suite - Global State Management
 * Zustand ile mode ve engine yönetimi
 */

import { create } from 'zustand';
import { WhiteboardMode, WhiteboardEngine, Tool, EngineConfig } from './engineTypes';

interface ModeStore {
  // Current state
  mode: WhiteboardMode;
  currentDocumentId: string | null;
  currentEngine: WhiteboardEngine | null;
  config: EngineConfig;
  
  // Tool state
  activeTool: Tool;
  color: string;
  lineWidth: number;
  
  // UI state
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  
  // Actions
  setMode: (mode: WhiteboardMode) => void;
  setEngine: (engine: WhiteboardEngine | null) => void;
  setDocumentId: (id: string | null) => void;
  setConfig: (config: Partial<EngineConfig>) => void;
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  setSaving: (saving: boolean) => void;
  setLoading: (loading: boolean) => void;
  updateLastSaved: () => void;
  
  // Engine commands
  save: () => Promise<void>;
  export: (format: 'svg' | 'png' | 'pdf' | 'json') => Promise<Blob | string>;
  clear: () => void;
  undo: () => void;
  redo: () => void;
}

export const useModeStore = create<ModeStore>((set, get) => ({
  // Initial state
  mode: 'board',
  currentDocumentId: null,
  currentEngine: null,
  config: {
    readOnly: false,
    theme: 'light',
    gridEnabled: true,
    snapToGrid: false,
    collaborationEnabled: false,
  },
  
  activeTool: 'pen',
  color: '#000000',
  lineWidth: 3,
  
  isSaving: false,
  isLoading: false,
  lastSaved: null,
  
  // Actions
  setMode: (mode) => set({ mode }),
  
  setEngine: (engine) => {
    set({ currentEngine: engine });
    // Apply current tool to new engine
    if (engine) {
      const { activeTool } = get();
      engine.setTool(activeTool);
    }
  },
  
  setDocumentId: (id) => set({ currentDocumentId: id }),
  
  setConfig: (config) => set((state) => ({
    config: { ...state.config, ...config }
  })),
  
  setTool: (tool) => {
    set({ activeTool: tool });
    const { currentEngine } = get();
    if (currentEngine) {
      currentEngine.setTool(tool);
    }
  },
  
  setColor: (color) => set({ color }),
  setLineWidth: (width) => set({ lineWidth: width }),
  setSaving: (saving) => set({ isSaving: saving }),
  setLoading: (loading) => set({ isLoading: loading }),
  updateLastSaved: () => set({ lastSaved: new Date() }),
  
  // Engine commands
  save: async () => {
    const { currentEngine, setSaving, updateLastSaved } = get();
    if (!currentEngine) return;
    
    try {
      setSaving(true);
      await currentEngine.saveDocument();
      updateLastSaved();
    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  },
  
  export: async (format) => {
    const { currentEngine } = get();
    if (!currentEngine) throw new Error('No engine available');
    return await currentEngine.exportDocument(format);
  },
  
  clear: () => {
    const { currentEngine } = get();
    if (currentEngine) {
      currentEngine.clear();
    }
  },
  
  undo: () => {
    const { currentEngine } = get();
    if (currentEngine) {
      currentEngine.undo();
    }
  },
  
  redo: () => {
    const { currentEngine } = get();
    if (currentEngine) {
      currentEngine.redo();
    }
  },
}));






