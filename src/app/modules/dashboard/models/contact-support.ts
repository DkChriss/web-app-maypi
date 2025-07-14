export interface ContactSupport {
    id: number;
    user_id: number;
    name: string;
    email: string;
    title: string;
    message: string;
}

export type ContactSupportStore = Omit<ContactSupport, 'id'>;

export type ContactSupportUpdate = Omit<
    ContactSupport,
    'id' | 'name' | 'email' | 'title' | 'message'
> &
    Partial<Pick<ContactSupport, 'name' | 'email' | 'title' | 'message'>>;
