import { create } from 'zustand';
import { Breakpoint, Component, Layout, Position, ComponentType } from './types';

interface BuilderState {
  layout: Layout;
  selectedComponentId: string | null;
  breakpoint: Breakpoint;
  history: Layout[];
  historyIndex: number;
  isDragging: boolean;

  // Computed properties
  selectedComponent: Component | null;

  // Layout actions
  updateLayout: (layout: Layout) => void;
  addComponent: (component: ComponentType, position: Position) => void;
  removeComponent: (componentId: string) => void;
  updateComponent: (componentId: string, updates: Partial<Component>) => void;

  // Selection actions
  setSelectedComponent: (componentId: string | null) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  saveToHistory: (layout: Layout) => void;

  // Breakpoint actions
  setBreakpoint: (breakpoint: Breakpoint) => void;

  // Drag state
  setIsDragging: (isDragging: boolean) => void;
}

const DEFAULT_GRID = {
  columns: 12,
  rowHeight: 40,
  gap: 16,
  snapToGrid: true,
};

const DEFAULT_BREAKPOINTS: Record<Breakpoint, { minWidth: number; columns: number; gap: number }> = {
  mobile: { minWidth: 0, columns: 4, gap: 8 },
  tablet: { minWidth: 768, columns: 8, gap: 12 },
  desktop: { minWidth: 1024, columns: 12, gap: 16 },
};

const DEFAULT_SPACING = {
  base: 4,
  scale: 1.25,
  units: 'rem' as const,
};

const DEFAULT_LAYOUT: Layout = {
  components: [],
  grid: DEFAULT_GRID,
  breakpoints: DEFAULT_BREAKPOINTS,
  spacing: DEFAULT_SPACING,
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  layout: DEFAULT_LAYOUT,
  selectedComponentId: null,
  breakpoint: 'desktop',
  history: [DEFAULT_LAYOUT],
  historyIndex: 0,
  isDragging: false,

  get selectedComponent() {
    const state = get();
    return state.selectedComponentId
      ? state.layout.components.find(c => c.id === state.selectedComponentId) || null
      : null;
  },

  updateLayout: (layout) => {
    set((state) => {
      const newState = { ...state, layout };
      state.saveToHistory(layout);
      return newState;
    });
  },

  addComponent: (componentType, position) => {
    const newComponent: Component = {
      id: crypto.randomUUID(),
      type: componentType,
      props: {},
      styles: {
        layout: {
          position: 'relative',
          width: '100%',
        },
        typography: {},
        colors: {},
        effects: {},
        responsive: {
          mobile: {},
          tablet: {},
          desktop: {},
        },
      },
    };

    set((state) => {
      const newLayout = {
        ...state.layout,
        components: [...state.layout.components, newComponent],
      };
      state.saveToHistory(newLayout);
      return { layout: newLayout };
    });
  },

  removeComponent: (componentId) => {
    set((state) => {
      const newLayout = {
        ...state.layout,
        components: state.layout.components.filter((c) => c.id !== componentId),
      };
      state.saveToHistory(newLayout);
      return { layout: newLayout };
    });
  },

  updateComponent: (componentId, updates) => {
    set((state) => {
      const newLayout = {
        ...state.layout,
        components: state.layout.components.map((c) =>
          c.id === componentId ? { ...c, ...updates } : c
        ),
      };
      state.saveToHistory(newLayout);
      return { layout: newLayout };
    });
  },

  setSelectedComponent: (componentId) => {
    set({ selectedComponentId: componentId });
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          layout: state.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return state;
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          layout: state.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return state;
    });
  },

  saveToHistory: (layout) => {
    set((state) => {
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        layout,
      ];
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setBreakpoint: (breakpoint) => {
    set({ breakpoint });
  },

  setIsDragging: (isDragging) => {
    set({ isDragging });
  },
}));