import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { ComponentPalette } from './ComponentPalette';
import { LayoutGrid } from './LayoutGrid';
import { PreviewPane } from './PreviewPane';
import { BuilderToolbar } from './BuilderToolbar';
import { useBuilderStore } from './store';
import { LandingPageBuilderProps, Position, ComponentType, AIPanelType } from './types';
import { Card } from '@/components/ui/card';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { 
  AIContentGenerator, 
  AIDesignSuggestions, 
  AIComponentRecommender, 
  AIStyleOptimizer 
} from './services/ai/components';
import {
  PageLibrary,
  PageCloneDialog,
  VersionHistory,
  PageExporter
} from './services/pages/components';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { nanoid } from 'nanoid';

const defaultCategories = ['Layout', 'Content', 'Media', 'Forms', 'Navigation'];

export function LandingPageBuilder({
  initialLayout,
  onSave,
  availableComponents,
}: LandingPageBuilderProps) {
  const {
    layout,
    breakpoint,
    isDragging,
    updateLayout,
    addComponent,
    setIsDragging,
    setBreakpoint,
    undo,
    redo,
    setSelectedComponent,
    selectedComponent,
  } = useBuilderStore();

  const [activeAIPanel, setActiveAIPanel] = useState<AIPanelType | null>(null);
  const [isPageLibraryOpen, setIsPageLibraryOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { toast } = useToast();

  // Mock pageId and pageName - In a real app, these would come from props or a router
  const pageId = 'current-page-id';
  const pageName = 'Current Page';

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    setSelectedComponent(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (over && active.data.current) {
      const componentType = active.data.current as ComponentType;
      const position: Position = {
        x: over.rect.left - over.rect.width / 2,
        y: over.rect.top - over.rect.height / 2,
      };

      addComponent(componentType, position);
    }
  };

  const handlePreviewResize = (width: number, height: number) => {
    // Handle preview resizing if needed
  };

  const handleOpenAIPanel = (panel: AIPanelType) => {
    setActiveAIPanel(panel);
  };

  // Page Management Handlers
  const handleImportComplete = (newPageId: string) => {
    toast({
      title: 'Page Imported',
      description: 'The page has been imported successfully.',
    });
    // In a real app, we would navigate to the new page
  };

  const handleVersionRevert = () => {
    toast({
      title: 'Version Restored',
      description: 'The page has been reverted to the selected version.',
    });
  };

  const renderAIPanel = () => {
    if (!activeAIPanel) return null;

    const commonProps = {
      onClose: () => setActiveAIPanel(null),
    };

    switch (activeAIPanel) {
      case 'content':
        return (
          <AIContentGenerator
            {...commonProps}
            componentType={selectedComponent?.type.name || ''}
            onContentGenerated={(content) => {
              if (selectedComponent) {
                updateLayout({
                  ...layout,
                  components: layout.components.map(c => 
                    c.id === selectedComponent.id 
                      ? { ...c, props: { ...c.props, content } }
                      : c
                  )
                });
              }
            }}
          />
        );
      case 'design':
        return (
          <AIDesignSuggestions
            {...commonProps}
            currentLayout={layout.components}
            breakpoint={breakpoint}
            onApplySuggestion={(changes) => {
              updateLayout({
                ...layout,
                components: layout.components.map(c => 
                  changes.layoutChanges.find(change => change.componentId === c.id)
                    ? { ...c, styles: { ...c.styles, ...changes.layoutChanges.find(change => change.componentId === c.id)?.changes } }
                    : c
                )
              });
            }}
          />
        );
      case 'components':
        return (
          <AIComponentRecommender
            {...commonProps}
            currentComponents={layout.components}
            onAddComponent={(suggestion) => {
              const newComponent = {
                id: `component-${Date.now()}`,
                type: suggestion.componentType,
                props: {},
                styles: {
                  layout: {},
                  typography: {},
                  colors: {},
                  effects: {},
                  responsive: {}
                }
              };
              
              addComponent(suggestion.componentType, {
                x: suggestion.suggestedPosition.index * layout.grid.gap,
                y: 0
              });
            }}
          />
        );
      case 'styles':
        return selectedComponent ? (
          <AIStyleOptimizer
            {...commonProps}
            component={selectedComponent}
            globalStyles={{}}
            onApplyStyles={(changes) => {
              if (selectedComponent) {
                updateLayout({
                  ...layout,
                  components: layout.components.map(c =>
                    c.id === selectedComponent.id
                      ? { ...c, styles: { ...c.styles, ...changes.styleChanges } }
                      : c
                  )
                });
              }
            }}
          />
        ) : null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <BuilderToolbar
        onUndo={undo}
        onRedo={redo}
        canUndo={useBuilderStore((state) => state.historyIndex > 0)}
        canRedo={useBuilderStore((state) => state.historyIndex < state.history.length - 1)}
        onSave={() => onSave(layout)}
        onPreview={() => {
          window.open('/preview', '_blank');
        }}
        breakpoint={breakpoint}
        onBreakpointChange={setBreakpoint}
        onOpenAIPanel={handleOpenAIPanel}
        pageId={pageId}
        pageName={pageName}
        onOpenPageLibrary={() => setIsPageLibraryOpen(true)}
        onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
        onClonePage={() => setIsCloneDialogOpen(true)}
        onExportPage={() => setIsExportOpen(true)}
      />

      <div className="flex-1 overflow-hidden">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={15}>
              <Card className="h-full rounded-none border-r">
                <ComponentPalette
                  categories={defaultCategories}
                  components={availableComponents}
                  searchTerm=""
                  onSearch={() => {}}
                />
              </Card>
            </ResizablePanel>

            <ResizablePanel defaultSize={50}>
              <LayoutGrid
                layout={layout}
                className={isDragging ? 'bg-blue-50' : ''}
              />
            </ResizablePanel>

            <ResizablePanel defaultSize={30} minSize={25}>
              <Card className="h-full rounded-none border-l">
                {activeAIPanel ? (
                  <div className="h-full overflow-y-auto p-4">
                    {renderAIPanel()}
                  </div>
                ) : (
                  <PreviewPane
                    layout={layout}
                    breakpoint={breakpoint}
                    scale={1}
                    onResize={handlePreviewResize}
                  />
                )}
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </DndContext>
      </div>

      {/* Page Management Dialogs */}
      {isPageLibraryOpen && (
        <PageLibrary
          onSelectPage={() => {}}
          onSelectTemplate={() => {}}
        />
      )}

      {isVersionHistoryOpen && (
        <VersionHistory
          pageId={pageId}
          currentVersion={{
            id: pageId,
            pageId,
            timestamp: Date.now(),
            state: layout,
            metadata: {
              name: pageName,
              author: 'Current User',
              tags: [],
              createdAt: Date.now(),
              modifiedAt: Date.now(),
            },
          }}
          onRevertToVersion={handleVersionRevert}
        />
      )}

      {isCloneDialogOpen && (
        <PageCloneDialog
          page={{
            id: pageId,
            pageId,
            timestamp: Date.now(),
            state: layout,
            metadata: {
              name: pageName,
              author: 'Current User',
              tags: [],
              createdAt: Date.now(),
              modifiedAt: Date.now(),
            },
          }}
          isOpen={isCloneDialogOpen}
          onClose={() => setIsCloneDialogOpen(false)}
          onCloned={(newPageId) => {
            setIsCloneDialogOpen(false);
            toast({
              title: 'Page Cloned',
              description: 'The page has been cloned successfully.',
            });
          }}
        />
      )}

      {isExportOpen && (
        <PageExporter
          pageId={pageId}
          pageName={pageName}
          onImportComplete={handleImportComplete}
        />
      )}
    </div>
  );
}