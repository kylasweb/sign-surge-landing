import { useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Layout, Component, Position } from './types';
import { useBuilderStore } from './store';

interface GridCellProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isHighlighted: boolean;
}

const GridCell = ({ x, y, width, height, isHighlighted }: GridCellProps) => (
  <div
    className={`absolute border border-dashed border-gray-200 ${
      isHighlighted ? 'bg-blue-100 border-blue-300' : ''
    }`}
    style={{
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
    }}
  />
);

interface GridOverlayProps {
  columns: number;
  rowHeight: number;
  gap: number;
  width: number;
  height: number;
  highlightedCell?: { x: number; y: number };
}

const GridOverlay = ({
  columns,
  rowHeight,
  gap,
  width,
  height,
  highlightedCell,
}: GridOverlayProps) => {
  const columnWidth = (width - (gap * (columns - 1))) / columns;
  const rows = Math.ceil(height / (rowHeight + gap));

  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = col * (columnWidth + gap);
      const y = row * (rowHeight + gap);
      
      cells.push(
        <GridCell
          key={`${row}-${col}`}
          x={x}
          y={y}
          width={columnWidth}
          height={rowHeight}
          isHighlighted={
            highlightedCell?.x === col && highlightedCell?.y === row
          }
        />
      );
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {cells}
    </div>
  );
};

interface DroppableComponentProps {
  component: Component;
  onResize?: (width: number, height: number) => void;
}

const DroppableComponent = ({ component, onResize }: DroppableComponentProps) => {
  const { setSelectedComponent } = useBuilderStore();

  return (
    <div
      className="absolute bg-white border rounded shadow-sm cursor-pointer hover:border-blue-500"
      style={{
        left: component.styles.layout.x || 0,
        top: component.styles.layout.y || 0,
        width: component.styles.layout.width || '100%',
        height: component.styles.layout.height || 'auto',
      }}
      onClick={() => setSelectedComponent(component.id)}
    >
      <div className="p-2">
        {component.type.name}
      </div>
    </div>
  );
};

interface LayoutGridProps {
  layout: Layout;
  className?: string;
  onDrop?: (component: Component, position: Position) => void;
}

export function LayoutGrid({ layout, className = '', onDrop }: LayoutGridProps) {
  const { grid, components } = layout;
  const { isOver, setNodeRef } = useDroppable({
    id: 'layout-grid',
  });

  const calculateGridPosition = useCallback((clientX: number, clientY: number) => {
    const gridElement = document.getElementById('layout-grid');
    if (!gridElement) return { x: 0, y: 0 };

    const rect = gridElement.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (grid.snapToGrid) {
      const columnWidth = rect.width / grid.columns;
      const snapX = Math.round(x / columnWidth) * columnWidth;
      const snapY = Math.round(y / grid.rowHeight) * grid.rowHeight;
      return { x: snapX, y: snapY };
    }

    return { x, y };
  }, [grid]);

  return (
    <div
      id="layout-grid"
      ref={setNodeRef}
      className={`relative w-full h-full min-h-[500px] bg-gray-50 ${
        isOver ? 'bg-blue-50' : ''
      } ${className}`}
    >
      <GridOverlay
        columns={grid.columns}
        rowHeight={grid.rowHeight}
        gap={grid.gap}
        width={1200} // This should be dynamic based on container width
        height={800} // This should be dynamic based on content height
      />

      {components.map((component) => (
        <DroppableComponent
          key={component.id}
          component={component}
        />
      ))}
    </div>
  );
}