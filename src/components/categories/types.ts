export interface CategoryEntity {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  parentId?: number | null;
  parent?: CategoryEntity | null;
  children?: CategoryEntity[];
  listings?: ListingEntity[];
  _counts?: { children: number; listings: number };
}

export interface ListingEntity {
  id: number;
  title: string;
  price?: number;
  status?: string;
  images?: { id: number; url: string; alt?: string }[];
  representatives?: { representative?: { id: number; fullName?: string } }[];
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  parentId?: number | null;
  isActive?: boolean;
}

export interface CategoryTreeNode extends CategoryEntity {
  depth: number;
  path: string; // breadcrumb path
}
