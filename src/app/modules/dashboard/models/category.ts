export interface Category {
    id: number;
    title: string;
    slug: string;
}

export type CategoryStore = Omit<Category, 'id'>;

export type CategoryUpdate = Omit<Category, 'id' | 'title' | 'slug'> &
    Partial<Pick<Category, 'title' | 'slug'>>;
