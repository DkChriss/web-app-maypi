export interface Faq {
    id: number
    category_id: number
    user_id: number
    question: string
    answer: string
}

export type FaqStore = Omit<Faq, 'id'>


export type FaqUpdate = Omit<Faq, 'id' | 'question' | 'answer'>
    & Partial<Pick<Faq, 'question' | 'answer'>>
