export class Tree<G extends ITreeNode> {
  objs: G[];

  constructor(objs: G[]) {
    this.objs = objs;
  }

  addItem(obj?: G) {
    if (obj && !this.objs.find((item) => item.id === obj.id))
      this.objs.push(obj);
  }

  getRoot(obj: G): string {
    if (!obj.parentId) {
      return obj.id;
    }
    const parent = this.objs.find((o) => o.id === obj.parentId);
    if (parent) {
      return this.getRoot(parent);
    } else {
      return obj.id;
    }
  }

  getChildren(obj: G) {
    return this.objs.filter((o) => o.parentId === obj.id);
  }

  getAllChildren(obj: G): G[] {
    const children = this.getChildren(obj);
    children.forEach((child) => {
      children.push(...this.getAllChildren(child));
    });
    return children;
  }

  getParent(obj: G) {
    return this.objs.find((item) => item.id === obj.parentId);
  }

  getAllParents(obj: G) {
    const parents = [] as G[];
    const parent = this.getParent(obj);
    if (parent) {
      parents.push(parent);
      if (parent.parentId) {
        parents.push(...this.getAllParents(parent));
      }
    }
    return parents;
  }

  getDepth(obj: G) {
    let depth = 0;
    if (obj.parentId) {
      depth += 1;
      const parent = this.objs.find((o) => o.id === obj.parentId);
      if (parent) {
        depth += this.getDepth(parent);
      }
    }
    return depth;
  }

  getMaxDepth(obj: G) {
    const children = this.getChildren(obj);
    if (children.length <= 0) return 0;
    const allChildren = this.getAllChildren(obj);
    const depth = this.getDepth(obj);
    const allDepths = allChildren.map((child) => {
      return this.getDepth(child) - depth;
    });
    return Math.max(...allDepths);
  }
}

export function getChildren<G extends ITreeNode>(objs: G[], obj: G) {
  return objs.filter((o) => o.parentId === obj.id);
}

export function getAllChildren<G extends ITreeNode>(objs: G[], obj: G) {
  const children = getChildren(objs, obj);
  children.forEach((child) => {
    children.push(...getAllChildren(objs, child));
  });
  return children;
}

export function getParent<G extends ITreeNode>(objs: G[], obj: G) {
  return objs.find((item) => item.id === obj.parentId);
}

export function getAllParents<G extends ITreeNode>(objs: G[], obj: G) {
  const parents = [] as G[];
  const parent = getParent(objs, obj);
  if (parent) {
    parents.push(parent);
    if (parent.parentId) {
      parents.push(...getAllParents(objs, parent));
    }
  }
  return parents;
}

export function addItem<G extends ITreeNode>(objs: G[], obj?: G) {
  if (obj && !objs.find((item) => item.id === obj.id)) objs.push(obj);
}

export function getRoot<G extends ITreeNode>(objs: G[], obj: G) {
  if (!obj.parentId) {
    return obj.id;
  }
  const parent = objs.find((o) => o.id === obj.parentId);
  if (parent) {
    return getRoot(objs, parent);
  } else {
    return obj.id;
  }
}

export interface ITreeNode {
  id: string;
  parentId: string | null;
}
