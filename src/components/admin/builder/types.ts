import { ReactNode } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export type AIPanelType = 'content' | 'design' | 'components' | 'styles';

export interface Position {
  x: number;
  y: number;
}

export interface ComponentType {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface Component {
  id: string;
  type: ComponentType;
  props: Record<string, unknown>;
  styles: StyleProperties;
  children?: Component[];
  constraints?: ComponentConstraints;
}

export interface ComponentConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  allowedChildren?: string[];
  maxChildren?: number;
}

export interface GridConfiguration {
  columns: number;
  rowHeight: number;
  gap: number;
  snapToGrid: boolean;
}

export interface BreakpointConfig {
  minWidth: number;
  columns: number;
  gap: number;
}

export interface SpacingSystem {
  base: number;
  scale: number;
  units: 'px' | 'rem' | 'em';
}

export interface Layout {
  components: Component[];
  grid: GridConfiguration;
  breakpoints: Record<Breakpoint, BreakpointConfig>;
  spacing: SpacingSystem;
}

// Style System
export interface LayoutStyles {
  display?: string;
  position?: string;
  width?: string | number;
  height?: string | number;
  margin?: string;
  padding?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string | number;
  x?: number;
  y?: number;
}

export interface TypographyStyles {
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlign?: string;
  color?: string;
}

export interface ColorStyles {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
}

export interface EffectStyles {
  opacity?: number;
  boxShadow?: string;
  transform?: string;
  transition?: string;
}

export interface StyleProperties {
  layout: LayoutStyles;
  typography: TypographyStyles;
  colors: ColorStyles;
  effects: EffectStyles;
  responsive: Record<Breakpoint, Partial<StyleProperties>>;
}

// Component Props Types
export interface DragAndDropCanvasProps {
  components: Component[];
  onDrop: (component: Component, position: Position) => void;
  onUpdate: (layout: Layout) => void;
  gridSize: number;
  snapToGrid: boolean;
}

export interface ComponentPaletteProps {
  categories: string[];
  components: ComponentType[];
  onDragStart: (component: ComponentType) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

export interface PreviewPaneProps {
  layout: Layout;
  breakpoint: Breakpoint;
  scale: number;
  onResize: (width: number, height: number) => void;
}

export interface BuilderToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  onPreview: () => void;
  breakpoint: Breakpoint;
  onBreakpointChange: (breakpoint: Breakpoint) => void;
  onOpenAIPanel: (panel: AIPanelType) => void;
  // Page Management
  pageId: string;
  pageName: string;
  onOpenPageLibrary: () => void;
  onOpenVersionHistory: () => void;
  onClonePage: () => void;
  onExportPage: () => void;
}

export interface LandingPageBuilderProps {
  initialLayout?: Layout;
  onSave: (layout: Layout) => void;
  availableComponents: ComponentType[];
}