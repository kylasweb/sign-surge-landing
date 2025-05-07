import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PageVersion, PageTemplate, PageVersionRecord, PageTemplateRecord } from '../types';

interface PagesDB extends DBSchema {
  'page-versions': {
    key: string;
    value: PageVersionRecord;
    indexes: {
      'by-page': string;
      'by-timestamp': number;
    };
  };
  'page-templates': {
    key: string;
    value: PageTemplateRecord;
    indexes: {
      'by-category': string;
    };
  };
  'pages': {
    key: string;
    value: {
      id: string;
      currentVersionId: string;
      name: string;
      metadata: {
        createdAt: number;
        modifiedAt: number;
        author: string;
        tags: string[];
      };
    };
    indexes: {
      'by-name': string;
      'by-modified': number;
    };
  };
}

const DB_NAME = 'pages-db';
const DB_VERSION = 1;

export async function initializeDB(): Promise<IDBPDatabase<PagesDB>> {
  const db = await openDB<PagesDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Page Versions Store
      const versionStore = db.createObjectStore('page-versions', {
        keyPath: 'id'
      });
      versionStore.createIndex('by-page', 'pageId');
      versionStore.createIndex('by-timestamp', 'version.timestamp');

      // Page Templates Store
      const templateStore = db.createObjectStore('page-templates', {
        keyPath: 'id'
      });
      templateStore.createIndex('by-category', 'template.category');

      // Pages Store
      const pagesStore = db.createObjectStore('pages', {
        keyPath: 'id'
      });
      pagesStore.createIndex('by-name', 'name');
      pagesStore.createIndex('by-modified', 'metadata.modifiedAt');
    }
  });

  return db;
}

export type PagesDatabase = IDBPDatabase<PagesDB>;

// Database Operations
export async function getDB(): Promise<PagesDatabase> {
  return await initializeDB();
}

// Page Version Operations
export async function savePageVersion(db: PagesDatabase, version: PageVersionRecord): Promise<void> {
  await db.put('page-versions', version);
}

export async function getPageVersion(db: PagesDatabase, id: string): Promise<PageVersionRecord | undefined> {
  return await db.get('page-versions', id);
}

export async function getPageVersionsByPageId(db: PagesDatabase, pageId: string): Promise<PageVersionRecord[]> {
  return await db.getAllFromIndex('page-versions', 'by-page', pageId);
}

// Template Operations
export async function saveTemplate(db: PagesDatabase, template: PageTemplateRecord): Promise<void> {
  await db.put('page-templates', template);
}

export async function getTemplate(db: PagesDatabase, id: string): Promise<PageTemplateRecord | undefined> {
  return await db.get('page-templates', id);
}

export async function getTemplatesByCategory(db: PagesDatabase, category: string): Promise<PageTemplateRecord[]> {
  return await db.getAllFromIndex('page-templates', 'by-category', category);
}

// Page Operations
export async function savePage(
  db: PagesDatabase,
  id: string,
  name: string,
  currentVersionId: string,
  metadata: {
    createdAt: number;
    modifiedAt: number;
    author: string;
    tags: string[];
  }
): Promise<void> {
  await db.put('pages', {
    id,
    name,
    currentVersionId,
    metadata
  });
}

export async function getPage(db: PagesDatabase, id: string) {
  return await db.get('pages', id);
}

export async function getPagesByModified(
  db: PagesDatabase,
  limit: number = 10
): Promise<Array<{
  id: string;
  name: string;
  currentVersionId: string;
  metadata: { createdAt: number; modifiedAt: number; author: string; tags: string[] };
}>> {
  const cursor = await db.transaction('pages').store.index('by-modified').openCursor(null, 'prev');
  const results = [];
  
  while (cursor && results.length < limit) {
    results.push(cursor.value);
    await cursor.continue();
  }
  
  return results;
}