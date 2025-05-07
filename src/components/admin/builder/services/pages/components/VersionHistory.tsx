import { useState, useEffect } from 'react';
import { pageService } from '../';
import { PageVersion, PageDiff } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { GitBranch, GitMerge, History, RotateCcw, Search } from 'lucide-react';
import { diff as deepDiff } from 'deep-object-diff';

interface VersionHistoryProps {
  pageId: string;
  currentVersion: PageVersion;
  onRevertToVersion: (version: PageVersion) => void;
}

export function VersionHistory({
  pageId,
  currentVersion,
  onRevertToVersion
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<PageVersion | null>(null);
  const [compareVersion, setCompareVersion] = useState<PageVersion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [diff, setDiff] = useState<PageDiff | null>(null);

  useEffect(() => {
    loadVersions();
  }, [pageId]);

  const loadVersions = async () => {
    const pageVersions = await pageService.listVersions(pageId);
    setVersions(pageVersions.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Filter versions by name or author
    // This will be expanded based on requirements
  };

  const handleVersionSelect = (version: PageVersion) => {
    if (selectedVersion && selectedVersion.id === version.id) {
      setSelectedVersion(null);
    } else {
      setSelectedVersion(version);
      if (compareVersion) {
        showDiff(version, compareVersion);
      }
    }
  };

  const handleCompareSelect = (version: PageVersion) => {
    if (compareVersion && compareVersion.id === version.id) {
      setCompareVersion(null);
      setDiff(null);
    } else {
      setCompareVersion(version);
      if (selectedVersion) {
        showDiff(selectedVersion, version);
      }
    }
  };

  const showDiff = (version1: PageVersion, version2: PageVersion) => {
    const differences = deepDiff(version2.state, version1.state);
    setDiff({
      versionId: version1.id,
      changes: Object.entries(differences).map(([path, change]) => ({
        type: 'modify',
        path,
        before: version2.state[path],
        after: version1.state[path]
      })),
      timestamp: Date.now()
    });
  };

  const handleCreateBranch = async () => {
    if (!selectedVersion || !branchName) return;

    try {
      await pageService.createBranch(selectedVersion.id, branchName);
      await loadVersions();
      setIsCreatingBranch(false);
      setBranchName('');
    } catch (error) {
      console.error('Error creating branch:', error);
    }
  };

  const handleMergeBranch = async (sourceBranch: string, targetBranch: string) => {
    try {
      await pageService.mergeBranch(sourceBranch, targetBranch);
      await loadVersions();
    } catch (error) {
      console.error('Error merging branches:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-4 p-4 border-b">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search versions..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`p-4 border rounded-lg ${
                selectedVersion?.id === version.id ? 'border-primary' : ''
              } ${compareVersion?.id === version.id ? 'bg-secondary/50' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{version.metadata.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(version.timestamp)} ago by {version.metadata.author}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {version.branchName && (
                    <Badge variant="outline">
                      <GitBranch className="w-3 h-3 mr-1" />
                      {version.branchName}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVersionSelect(version)}
                  >
                    Select
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCompareSelect(version)}
                  >
                    Compare
                  </Button>
                </div>
              </div>

              {version.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {version.metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {selectedVersion?.id === version.id && (
                <div className="mt-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRevertToVersion(version)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Revert to this version
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreatingBranch(true)}
                  >
                    <GitBranch className="w-4 h-4 mr-2" />
                    Create Branch
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {diff && (
        <div className="border-t p-4">
          <h3 className="font-medium mb-2">Changes</h3>
          <ScrollArea className="h-48">
            {diff.changes.map((change, index) => (
              <div key={index} className="mb-2 text-sm">
                <span className="font-mono">{change.path}:</span>
                <br />
                <span className="text-red-500">- {JSON.stringify(change.before)}</span>
                <br />
                <span className="text-green-500">+ {JSON.stringify(change.after)}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}

      <Dialog open={isCreatingBranch} onOpenChange={setIsCreatingBranch}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Branch</DialogTitle>
            <DialogDescription>
              Enter a name for the new branch
            </DialogDescription>
          </DialogHeader>
          <Input
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="Branch name"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingBranch(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBranch} disabled={!branchName}>
              Create Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}