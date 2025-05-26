export interface StatusEnum {
    'online': 'online',
    'away': 'away',
    'busy': 'busy',
    'not_visible': 'not_visible'
}

export interface User {
    id: number,
    code: string,
    name: string,
    last_name: string,
    second_surname: string,
    email: string,
    status: StatusEnum,
    phone: number
}

export type UserStore = Omit<User, 'id'>

export type UserUpdate = Omit<User, 'id' | 'code' | 'name' | 'last_name' | 'second_surname' | 'email' | 'status' | 'phone'>
    & Partial<Pick<User, 'code' | 'name' | 'last_name' | 'second_surname' | 'email' | 'status' | 'phone'>>
