export enum StatusMissingEnum {
    pending = "pending",
    progress = "progress",
    suspended = "suspended",
    resumed = "resumed",
    completed = "completed"
}

export interface Missing {
    id: number,
    user_id: number,
    name: string,
    last_name: string,
    age: number,
    gender: string,
    description: string,
    birthdate: Date,
    disappearance_date: Date,
    place_of_disappearance: string,
    status_missing: StatusMissingEnum,
    characteristics: string,
    reporter_name: string,
    reporter_phone: string,
    location: any
}

export type MissingStore = Omit<Missing, 'id'>

export type MissingUpdate = Omit<Missing, 'id' | 'name' | 'last_name' | 'gender' | 'description' |
    'birthdate' | 'disappearance_date' | 'place_of_disappearance' | 'status_missing' | 'characteristics' |
    'reporter_name' | 'reporter_phone' | 'location'>
    & Partial<Pick<Missing, 'name' | 'last_name' | 'gender' | 'description' |
        'birthdate' | 'disappearance_date' | 'place_of_disappearance' | 'status_missing' | 'characteristics' |
        'reporter_name' | 'reporter_phone' | 'location'>>
