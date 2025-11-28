/**
 * Zercode Whiteboard Suite - Engine Interface
 * Tüm whiteboard motorları bu interface'i implement eder
 */

export type WhiteboardMode = 'board' | 'slides' | 'pdf';

export type Tool = 
  | 'select'
  | 'pen'
  | 'eraser'
  | 'arrow'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'text'
  | 'highlighter'
  | 'sticky';

export interface WhiteboardDocument {
  id: string;
  tenant_id: string;
  title: string;
  mode: WhiteboardMode;
  content: any; // JSON - engine-specific
  created_at: string;
  updated_at: string;
}

export interface WhiteboardEngine {
  /**
   * Dokümanı yükle (DB'den)
   */
  loadDocument(id: string): Promise<void>;

  /**
   * Dokümanı kaydet (DB'ye)
   */
  saveDocument(): Promise<void>;

  /**
   * Export (SVG, PNG, PDF vb.)
   */
  exportDocument(format: 'svg' | 'png' | 'pdf' | 'json'): Promise<Blob | string>;

  /**
   * Aktif aracı değiştir
   */
  setTool(tool: Tool): void;

  /**
   * Temizle
   */
  clear(): void;

  /**
   * Undo
   */
  undo(): void;

  /**
   * Redo
   */
  redo(): void;

  /**
   * Engine'in hazır olup olmadığı
   */
  isReady(): boolean;
}

export interface EngineConfig {
  readOnly?: boolean;
  theme?: 'light' | 'dark';
  gridEnabled?: boolean;
  snapToGrid?: boolean;
  collaborationEnabled?: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  tool: Tool;
  points: Point[];
  color: string;
  width: number;
  opacity?: number;
}

export interface Annotation {
  id: string;
  page: number;
  strokes: Stroke[];
  timestamp: string;
}

