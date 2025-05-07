import { Layout } from "../../types";

export interface PageVersion {
  id: string;
  pageId: string;
  timestamp: number;
  state: Layout;
  metadata: PageMetadata;
  parentVersion?: string;
  branchName?: string;
}

export interface PageMetadata {
  name: string;
  description?: string;
  tags: string[];
  templateId?: string;
  createdAt: number;
  modifiedAt: number;
  author: string;
}

export interface PageTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  thumbnail?: string;
  state: Layout;
  metadata: PageMetadata;
}

export interface PageDiff {
  versionId: string;
  changes: {
    type: 'add' | 'remove' | 'modify';
    path: string;
    before?: any;
    after?: any;
  }[];
  timestamp: number;
}

export interface PageExport {
  version: PageVersion;
  template?: PageTemplate;
  history?: PageVersion[];
  diffs?: PageDiff[];
}

// Database schema types
export interface PageVersionRecord {
  id: string;
  pageId: string;
  version: PageVersion;
  compressedState: string;
  diff?: PageDiff;
}

export interface PageTemplateRecord {
  id: string;
  template: PageTemplate;
  compressedState: string;
}

export interface SearchQuery {
  term?: string;
  tags?: string[];
  timeRange?: {
    start: number;
    end: number;
  };
  author?: string;
}

export interface IPageService {
  // Version Control
  createVersion(pageId: string, state: Layout, metadata: PageMetadata): Promise<PageVersion>;
  getVersion(versionId: string): Promise<PageVersion>;
  listVersions(pageId: string): Promise<PageVersion[]>;
  revertToVersion(versionId: string): Promise<void>;
  
  // Templates
  createTemplate(state: Layout, metadata: PageMetadata): Promise<PageTemplate>;
  applyTemplate(templateId: string, pageId: string): Promise<void>;
  listTemplates(query?: SearchQuery): Promise<PageTemplate[]>;
  
  // Import/Export
  exportPage(pageId: string, includeHistory?: boolean): Promise<PageExport>;
  importPage(exportData: PageExport): Promise<string>;
  
  // Cloning
  clonePage(pageId: string, newMetadata: PageMetadata): Promise<string>;
  
  // Search
  searchPages(query: SearchQuery): Promise<PageVersion[]>;
  
  // Branch Management
  createBranch(versionId: string, branchName: string): Promise<PageVersion>;
  mergeBranch(sourceBranch: string, targetBranch: string): Promise<void>;
}