export interface Device {
    id: number;
    user_id: number;
    code: string;
    name: string;
    password: string;
    status: boolean;
}

export type DeviceStore = Omit<Device, 'id'>;

export type DeviceUpdate = Omit<
    Device,
    'id' | 'code' | 'name' | 'password' | 'status'
> &
    Partial<Pick<Device, 'code' | 'name' | 'password' | 'status'>>;
