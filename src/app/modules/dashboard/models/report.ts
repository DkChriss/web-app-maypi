export interface Report {
    id: number;
    user_id: number;
    missing_id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    description: string;
}

export type ReportStore = Omit<Report, 'id'>;

export type ReportUpdate = Omit<Report, 'id' | 'user_id'> &
    Partial<
        Pick<
            Report,
            | 'user_id'
            | 'missing_id'
            | 'name'
            | 'email'
            | 'phone'
            | 'location'
            | 'description'
        >
    >;
