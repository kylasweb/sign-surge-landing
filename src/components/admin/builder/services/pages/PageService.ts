import { nanoid } from 'nanoid';
import { compress, decompress } from 'lz-string';
import { Layout } from '../../types';
import {
  IPageService,
  PageVersion,
  PageTemplate,
  PageMetadata,
  PageExport,
  PageVersionRecord,
  PageTemplateRecord,
  SearchQuery,
  PageDiff
} from './types';
import { generateDiff, applyDiff, revertDiff, mergeDiffs } from './utils/diffUtils';
import {
  getDB,
  PagesDatabase,
  savePageVersion,
  getPageVersion,
  getPageVersionsByPageId,
  saveTemplate,
  getTemplate,
  getTemplatesByCategory,
  savePage,
  getPage,
  getPagesByModified
} from './utils/db';

export class PageService implements IPageService {
  private db: PagesDatabase | null = null;

  private async getDatabase(): Promise<PagesDatabase> {
    if (!this.db) {
      this.db = await getDB();
    }
    return this.db;
  }

  private compressState(state: Layout): string {
    return compress(JSON.stringify(state));
  }

  private decompressState(compressed: string): Layout {
    return JSON.parse(decompress(compressed) || '{}');
  }

  async createVersion(pageId: string, state: Layout, metadata: PageMetadata): Promise<PageVersion> {
    const db = await this.getDatabase();
    const page = await getPage(db, pageId);
    
    if (!page) {
      throw new Error(`Page ${pageId} not found`);
    }

    let diff: PageDiff | undefined;
    if (page.currentVersionId) {
      const currentVersion = await this.getVersion(page.currentVersionId);
      diff = generateDiff(currentVersion.state, state);
    }

    const version: PageVersion = {
      id: nanoid(),
      pageId,
      timestamp: Date.now(),
      state,
      metadata: {
        ...metadata,
        modifiedAt: Date.now()
      }
    };

    const record: PageVersionRecord = {
      id: version.id,
      pageId,
      version,
      compressedState: this.compressState(state),
      diff
    };

    await savePageVersion(db, record);
    await savePage(db, pageId, metadata.name, version.id, metadata);

    return version;
  }

  async getVersion(versionId: string): Promise<PageVersion> {
    const db = await this.getDatabase();
    const record = await getPageVersion(db, versionId);
    
    if (!record) {
      throw new Error(`Version ${versionId} not found`);
    }

    record.version.state = this.decompressState(record.compressedState);
    return record.version;
  }

  async listVersions(pageId: string): Promise<PageVersion[]> {
    const db = await this.getDatabase();
    const records = await getPageVersionsByPageId(db, pageId);
    return records.map(record => ({
      ...record.version,
      state: this.decompressState(record.compressedState)
    }));
  }

  async revertToVersion(versionId: string): Promise<void> {
    const version = await this.getVersion(versionId);
    await this.createVersion(
      version.pageId,
      version.state,
      {
        ...version.metadata,
        name: `Reverted to ${version.metadata.name}`,
        modifiedAt: Date.now()
      }
    );
  }

  async createTemplate(state: Layout, metadata: PageMetadata): Promise<PageTemplate> {
    const db = await this.getDatabase();
    const template: PageTemplate = {
      id: nanoid(),
      name: metadata.name,
      description: metadata.description,
      category: 'custom',
      state,
      metadata: {
        ...metadata,
        modifiedAt: Date.now()
      }
    };

    const record: PageTemplateRecord = {
      id: template.id,
      template,
      compressedState: this.compressState(state)
    };

    await saveTemplate(db, record);
    return template;
  }

  async applyTemplate(templateId: string, pageId: string): Promise<void> {
    const db = await this.getDatabase();
    const templateRecord = await getTemplate(db, templateId);
    
    if (!templateRecord) {
      throw new Error(`Template ${templateId} not found`);
    }

    const state = this.decompressState(templateRecord.compressedState);
    await this.createVersion(pageId, state, {
      ...templateRecord.template.metadata,
      name: `Applied template: ${templateRecord.template.name}`,
      templateId,
      modifiedAt: Date.now()
    });
  }

  async listTemplates(query?: SearchQuery): Promise<PageTemplate[]> {
    const db = await this.getDatabase();
    let templates: PageTemplateRecord[];

    if (query?.term) {
      // Implement search logic here
      templates = await getTemplatesByCategory(db, 'custom');
      templates = templates.filter(record => 
        record.template.name.toLowerCase().includes(query.term!.toLowerCase()) ||
        record.template.description?.toLowerCase().includes(query.term!.toLowerCase())
      );
    } else {
      templates = await getTemplatesByCategory(db, 'custom');
    }

    return templates.map(record => ({
      ...record.template,
      state: this.decompressState(record.compressedState)
    }));
  }

  async exportPage(pageId: string, includeHistory = false): Promise<PageExport> {
    const version = await this.getVersion(pageId);
    const history = includeHistory ? await this.listVersions(pageId) : undefined;
    
    return {
      version,
      history,
      diffs: history?.map((v, i) => 
        i > 0 ? generateDiff(history[i - 1].state, v.state) : undefined
      ).filter((d): d is PageDiff => !!d)
    };
  }

  async importPage(exportData: PageExport): Promise<string> {
    const pageId = nanoid();
    const { version, history } = exportData;

    if (history) {
      for (const historyVersion of history) {
        await this.createVersion(
          pageId,
          historyVersion.state,
          historyVersion.metadata
        );
      }
    } else {
      await this.createVersion(pageId, version.state, version.metadata);
    }

    return pageId;
  }

  async clonePage(pageId: string, newMetadata: PageMetadata): Promise<string> {
    const version = await this.getVersion(pageId);
    const newPageId = nanoid();
    
    await this.createVersion(newPageId, version.state, {
      ...newMetadata,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    });

    return newPageId;
  }

  async searchPages(query: SearchQuery): Promise<PageVersion[]> {
    const db = await this.getDatabase();
    const pages = await getPagesByModified(db, 100); // Get last 100 modified pages
    const versions: PageVersion[] = [];

    for (const page of pages) {
      if (query.term && !page.name.toLowerCase().includes(query.term.toLowerCase())) {
        continue;
      }

      if (query.tags && !query.tags.some(tag => page.metadata.tags.includes(tag))) {
        continue;
      }

      if (query.timeRange) {
        if (page.metadata.modifiedAt < query.timeRange.start || 
            page.metadata.modifiedAt > query.timeRange.end) {
          continue;
        }
      }

      if (query.author && page.metadata.author !== query.author) {
        continue;
      }

      const version = await this.getVersion(page.currentVersionId);
      versions.push(version);
    }

    return versions;
  }

  async createBranch(versionId: string, branchName: string): Promise<PageVersion> {
    const version = await this.getVersion(versionId);
    return await this.createVersion(
      version.pageId,
      version.state,
      {
        ...version.metadata,
        name: `Branch: ${branchName}`,
        modifiedAt: Date.now()
      }
    );
  }

  async mergeBranch(sourceBranch: string, targetBranch: string): Promise<void> {
    const sourceVersion = await this.getVersion(sourceBranch);
    const targetVersion = await this.getVersion(targetBranch);
    
    const diff = generateDiff(targetVersion.state, sourceVersion.state);
    const mergedState = applyDiff(targetVersion.state, diff);
    
    await this.createVersion(
      targetVersion.pageId,
      mergedState,
      {
        ...targetVersion.metadata,
        name: `Merged from ${sourceVersion.metadata.name}`,
        modifiedAt: Date.now()
      }
    );
  }
}