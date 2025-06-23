export interface Role {
    id: number;
    name: string;
    description: string;
}

export type RoleStore = Omit<Role, 'id'>;

export type RoleUpdate = Omit<Role, 'id' | 'name' | 'description'> &
    Partial<Pick<Role, 'name' | 'description'>>;
