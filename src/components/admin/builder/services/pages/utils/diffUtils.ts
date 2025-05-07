import { Layout, Component, StyleProperties } from "../../../types";
import { PageDiff } from "../types";

type Path = string[];
type ChangeType = 'add' | 'remove' | 'modify';
type Change = PageDiff["changes"][0];

function compareObjects(before: any, after: any, path: Path = []): Change[] {
  const changes: Change[] = [];

  // Handle arrays (like components array)
  if (Array.isArray(before) && Array.isArray(after)) {
    const beforeMap = new Map(before.map(item => [item.id, item]));
    const afterMap = new Map(after.map(item => [item.id, item]));

    // Find removed items
    for (const [id, item] of beforeMap) {
      if (!afterMap.has(id)) {
        changes.push({
          type: 'remove' as ChangeType,
          path: [...path, id].join('.'),
          before: item,
        });
      }
    }

    // Find added/modified items
    for (const [id, afterItem] of afterMap) {
      const beforeItem = beforeMap.get(id);
      if (!beforeItem) {
        changes.push({
          type: 'add' as ChangeType,
          path: [...path, id].join('.'),
          after: afterItem,
        });
      } else if (JSON.stringify(beforeItem) !== JSON.stringify(afterItem)) {
        changes.push({
          type: 'modify' as ChangeType,
          path: [...path, id].join('.'),
          before: beforeItem,
          after: afterItem,
        });
      }
    }

    return changes;
  }

  // Handle objects
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

    for (const key of allKeys) {
      const beforeVal = before[key];
      const afterVal = after[key];

      if (!(key in after)) {
        changes.push({
          type: 'remove' as ChangeType,
          path: [...path, key].join('.'),
          before: beforeVal,
        });
      } else if (!(key in before)) {
        changes.push({
          type: 'add' as ChangeType,
          path: [...path, key].join('.'),
          after: afterVal,
        });
      } else if (typeof beforeVal === 'object' && typeof afterVal === 'object') {
        changes.push(...compareObjects(beforeVal, afterVal, [...path, key]));
      } else if (beforeVal !== afterVal) {
        changes.push({
          type: 'modify' as ChangeType,
          path: [...path, key].join('.'),
          before: beforeVal,
          after: afterVal,
        });
      }
    }

    return changes;
  }

  // Handle primitive values
  if (before !== after) {
    changes.push({
      type: 'modify' as ChangeType,
      path: path.join('.'),
      before,
      after,
    });
  }

  return changes;
}

export function generateDiff(before: Layout, after: Layout): PageDiff {
  return {
    versionId: '', // This will be set by the PageService
    changes: compareObjects(before, after),
    timestamp: Date.now()
  };
}

export function applyDiff(layout: Layout, diff: PageDiff): Layout {
  const result = JSON.parse(JSON.stringify(layout));

  for (const change of diff.changes) {
    const path = change.path.split('.');
    const target = path.slice(0, -1).reduce((obj, key) => obj[key], result);
    const lastKey = path[path.length - 1];

    switch (change.type) {
      case 'add':
      case 'modify':
        target[lastKey] = change.after;
        break;
      case 'remove':
        delete target[lastKey];
        break;
    }
  }

  return result;
}

export function revertDiff(diff: PageDiff): PageDiff {
  return {
    versionId: diff.versionId,
    timestamp: Date.now(),
    changes: diff.changes.map(change => {
      const revertedType: ChangeType = 
        change.type === 'add' ? 'remove' :
        change.type === 'remove' ? 'add' :
        'modify';
      
      return {
        type: revertedType,
        path: change.path,
        before: change.after,
        after: change.before,
      };
    }).reverse()
  };
}

export function mergeDiffs(base: Layout, diffs: PageDiff[]): Layout {
  return diffs.reduce((layout, diff) => applyDiff(layout, diff), JSON.parse(JSON.stringify(base)));
}