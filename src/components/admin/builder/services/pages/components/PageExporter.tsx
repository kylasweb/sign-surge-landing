import { useState, useRef } from 'react';
import { pageService } from '../';
import { PageExport } from '../types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PageExporterProps {
  pageId: string;
  pageName: string;
  onImportComplete: (newPageId: string) => void;
}

export function PageExporter({
  pageId,
  pageName,
  onImportComplete
}: PageExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [includeHistory, setIncludeHistory] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = await pageService.exportPage(pageId, includeHistory);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pageName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: 'The page has been exported successfully.'
      });
    } catch (error) {
      console.error('Error exporting page:', error);
      toast({
        title: 'Export failed',
        description: 'There was an error exporting the page.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const importData = JSON.parse(content) as PageExport;
          
          // Validate import data structure
          if (!importData.version || !importData.version.state) {
            throw new Error('Invalid import file format');
          }

          const newPageId = await pageService.importPage(importData);
          onImportComplete(newPageId);
          
          toast({
            title: 'Import successful',
            description: 'The page has been imported successfully.'
          });
        } catch (error) {
          console.error('Error parsing import file:', error);
          toast({
            title: 'Import failed',
            description: 'The selected file is not a valid page export.',
            variant: 'destructive'
          });
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing page:', error);
      toast({
        title: 'Import failed',
        description: 'There was an error importing the page.',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-history"
            checked={includeHistory}
            onCheckedChange={(checked) => setIncludeHistory(checked as boolean)}
          />
          <Label htmlFor="include-history">Include version history</Label>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
          className="ml-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
        <Button
          variant="outline"
          onClick={handleImportClick}
          disabled={isImporting}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isImporting ? 'Importing...' : 'Import'}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Alert>
        <AlertDescription>
          Exported files contain the complete page configuration and can be imported into any Sign Surge installation.
          {includeHistory && ' Version history will be included in the export.'}
        </AlertDescription>
      </Alert>

      {/* Import confirmation dialog could be added here if needed */}
    </div>
  );
}