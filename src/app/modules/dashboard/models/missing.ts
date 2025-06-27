export enum StatusMissingEnum {
    pending = 'pending',
    progress = 'progress',
    suspended = 'suspended',
    resumed = 'resumed',
    completed = 'completed',
}

export interface Missing {
    id: number;
    user_id: number;
    name: string;
    last_name: string;
    age: number;
    gender: string;
    description: string;
    birthdate: Date;
    disappearance_date: Date;
    place_of_disappearance: string;
    status_missing: StatusMissingEnum;
    photo: File;
    characteristics: string;
    reporter_name: string;
    reporter_phone: string;
    event_photo: File;
}

export type MissingStore = Omit<Missing, 'id'>;

export type MissingUpdate = Omit<
    Missing,
    | 'id'
    | 'name'
    | 'last_name'
    | 'gender'
    | 'description'
    | 'birthdate'
    | 'disappearance_date'
    | 'place_of_disappearance'
    | 'status_missing'
    | 'characteristics'
    | 'reporter_name'
    | 'reporter_phone'
    | 'location'
> &
    Partial<
        Pick<
            Missing,
            | 'name'
            | 'last_name'
            | 'gender'
            | 'description'
            | 'birthdate'
            | 'disappearance_date'
            | 'place_of_disappearance'
            | 'status_missing'
            | 'characteristics'
            | 'reporter_name'
            | 'reporter_phone'
        >
    >;

export function buildMissingFormData(data: MissingUpdate): FormData {
    const formData = new FormData();

    formData.append('user_id', String(data.user_id));

    if (data.name) formData.append('name', data.name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.age != null) formData.append('age', String(data.age));
    if (data.gender) formData.append('gender', data.gender);
    if (data.description) formData.append('description', data.description);

    if (data.birthdate) {
        formData.append('birthdate', data.birthdate.toISOString());
    }
    if (data.disappearance_date) {
        formData.append(
            'disappearance_date',
            data.disappearance_date.toISOString()
        );
    }

    if (data.place_of_disappearance)
        formData.append('place_of_disappearance', data.place_of_disappearance);
    if (data.status_missing)
        formData.append('status_missing', data.status_missing);

    if (data.photo) {
        formData.append('photo', data.photo);
    }
    if (data.event_photo) {
        formData.append('event_photo', data.event_photo);
    }

    if (data.characteristics)
        formData.append('characteristics', data.characteristics);
    if (data.reporter_name)
        formData.append('reporter_name', data.reporter_name);
    if (data.reporter_phone)
        formData.append('reporter_phone', data.reporter_phone);

    return formData;
}
