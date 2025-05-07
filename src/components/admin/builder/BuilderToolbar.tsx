import { 
  Undo2, 
  Redo2, 
  Save, 
  Eye, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Sparkles, 
  ChevronDown,
  Library,
  Copy,
  History,
  Download,
  FileUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Breakpoint, BuilderToolbarProps } from './types';

export function BuilderToolbar({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  onPreview,
  breakpoint,
  onBreakpointChange,
  onOpenAIPanel,
  pageId,
  pageName,
  onOpenPageLibrary,
  onOpenVersionHistory,
  onClonePage,
  onExportPage,
}: BuilderToolbarProps) {
  return (
    <div className="flex items-center p-2 border-b bg-white">
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="mx-2 h-6" />

      <ToggleGroup
        type="single"
        value={breakpoint}
        onValueChange={(value: Breakpoint) => onBreakpointChange(value)}
        className="flex items-center gap-1"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value="mobile"
              size="sm"
              className="px-2 py-1"
            >
              <Smartphone className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Mobile View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value="tablet"
              size="sm"
              className="px-2 py-1"
            >
              <Tablet className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Tablet View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value="desktop"
              size="sm"
              className="px-2 py-1"
            >
              <Laptop className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Desktop View</TooltipContent>
        </Tooltip>
      </ToggleGroup>

      <div className="ml-auto flex items-center gap-2">
        {/* Page Management Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Library className="h-4 w-4" />
                  Pages
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Page Management</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpenPageLibrary}>
              <Library className="h-4 w-4 mr-2" />
              Page Library
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenVersionHistory}>
              <History className="h-4 w-4 mr-2" />
              Version History
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClonePage}>
              <Copy className="h-4 w-4 mr-2" />
              Clone Page
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPage}>
              <Download className="h-4 w-4 mr-2" />
              Export/Import
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* AI Assistant Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Assistant
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>AI-Powered Features</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onOpenAIPanel('content')}>
              Generate Content
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onOpenAIPanel('design')}>
              Design Suggestions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onOpenAIPanel('components')}>
              Component Recommendations
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onOpenAIPanel('styles')}>
              Style Optimization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open in New Window</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={onSave}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save Changes (Ctrl+S)</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}