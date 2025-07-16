export enum StatusEnum {
    online = 'online',
    away = 'away',
    busy = 'busy',
    not_visible = 'not_visible',
}

export interface User {
    id: number;
    code: string;
    name: string;
    last_name: string;
    second_surname: string;
    email: string;
    user_status: StatusEnum;
    password: string;
    phone: number;
    avatar: File;
    token_firebase: string;
}

export type UserStore = Omit<User, 'id'>;

export type UserUpdate = Omit<
    User,
    | 'id'
    | 'code'
    | 'name'
    | 'last_name'
    | 'second_surname'
    | 'email'
    | 'user_status'
    | 'phone'
    | 'avatar'
    | 'password'
> &
    Partial<
        Pick<
            User,
            | 'code'
            | 'name'
            | 'last_name'
            | 'second_surname'
            | 'email'
            | 'user_status'
            | 'phone'
            | 'avatar'
            | 'password'
        >
    >;

export interface UserRole {
    user_id: number;
    roles_ids: Array<number>;
}

export interface UserPermission {
    user_id: number;
    permissions_ids: Array<number>;
}
