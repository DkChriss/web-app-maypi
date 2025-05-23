export interface EmergencyContact {
    id: number,
    user_id: number,
    name: string,
    line: string,
    phone: number
}

export type EmergencyContactStore = Omit<EmergencyContact, 'id'>

export type EmergencyContactUpdate = Omit<EmergencyContact, 'id' | 'name' | 'line' | 'phone'>
    & Partial<Pick<EmergencyContact, 'name' | 'line' | 'phone'>>

