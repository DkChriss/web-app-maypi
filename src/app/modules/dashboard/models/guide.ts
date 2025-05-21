export interface Guide {
    id: number,
    user_id: number,
    category_id: number,
    slug: string,
    title: string,
    subtitle: string,
    content: string
}

export type GuideStore = Omit<Guide, 'id'>

export type GuideUpdate = Omit<Guide, 'id' | 'slug' | 'title' | 'subtitle' | 'content'>
    & Partial<Pick<Guide, 'slug' | 'title' | 'subtitle' | 'content'>>
