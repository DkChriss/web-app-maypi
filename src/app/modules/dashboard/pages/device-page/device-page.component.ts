import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Device, DeviceStore, DeviceUpdate } from '../../models/device';
import { DeviceService } from '../../services/device.service';
import { UntypedFormGroup, FormGroup, FormControl, Validators, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { QuillModule } from 'ngx-quill';

@Component({
    selector: 'app-device-page',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        QuillModule,
        MatCardModule,
        MatDialogModule,
    ],
    templateUrl: './device-page.component.html',
    styleUrl: './device-page.component.scss'
})
export class DevicePageComponent implements OnInit, OnDestroy {
    @ViewChild('select_1', { static: false }) select_1: MatSelect;

    configForm: UntypedFormGroup;
    isLoading = false;
    isEditMode = false;
    selectedDevice: Device | null = null
    method = 'store'
    deviceForm = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(null, Validators.required),
            code: new FormControl<string>('', Validators.required),
            name: new FormControl<string>('', Validators.required),
            password: new FormControl<string>('', Validators.required),
            status: new FormControl<boolean>(false, Validators.required),
        })
    }

    deviceTable = {
        reload: new BehaviorSubject<void>(null)
    }

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    totalItems = 0
    devices: any

    //USERS
    pageSizeUserSelect$ = new BehaviorSubject<number>(10)
    pageNumberUserSelect$ = new BehaviorSubject<number>(1)

    deviceList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.deviceTable.reload
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this._deviceService.list(
            parseInt(this.pageNumber$.value.toString()),
            parseInt(this.pageSize$.value.toString())
        ).pipe(
            tap((res: any) => {
                this.totalItems = res.total
                this.devices = res.data
                this.isLoading = false
            })
        ))
    )

    users: any = []
    canLoadMore: boolean = false

    userSelect = {
        reload: new BehaviorSubject<void>(null)
    }


    userSelectList$ = combineLatest([
        this.pageSizeUserSelect$,
        this.pageNumberUserSelect$,
        this.userSelect.reload
    ]).pipe(
        distinctUntilChanged(),
        switchMap(() => this._userService.list(
            parseInt(this.pageNumberUserSelect$.value.toString()),
            parseInt(this.pageSizeUserSelect$.value.toString())
        ).pipe(
            tap((res: any) => {
                this.canLoadMore = res.links.next !== null
                if (this.users.length === 0) {
                    this.users = res.data
                } else {
                    res.data.forEach(element => {
                        if (!this.users.some(user => user.id === element.user.id)) {
                            this.users.push(element)
                        }
                    });
                }
            })
        ))
    )

    constructor(
        private _deviceService: DeviceService,
        private _userService: UserService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
    ) { }

    ngOnInit(): void {
        this.isLoading = false
        this.configForm = this._formBuilder.group({
            title: 'Eliminar Dispositivo',
            message: 'Esta seguro de eliminar el dispositivo? <span class="font-medium">Esta accion no puede ser reversible!</span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Eliminar',
                    color: 'warn',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancelar',
                }),
            }),
            dismissible: false,
        });
    }

    ngOnDestroy(): void {

    }

    openStore(): void {
        this.deviceForm.formGroup.reset()
        this.closeDetails()
        this.isEditMode = true;
        let newDevice: Device = {
            id: this.devices[0]["id"],
            user_id: 1,
            code: 'code',
            name: 'name',
            password: 'password',
            status: false
        }
        this.method = 'store'
        this.selectedDevice = newDevice
    }

    store(): void {
        this.deviceForm.submitted = true
        if (this.deviceForm.formGroup.valid) {
            this.deviceForm.submitting = true
            const newDevice: DeviceStore = this.deviceForm.formGroup.getRawValue()
            this._deviceService.store(newDevice).subscribe({
                next: (resp: any) => {
                    this.deviceTable.reload.next();
                    this.closeDetails();
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    toggleDetails(device: Device): void {
        this.isEditMode = !this.isEditMode
        if (this.selectedDevice?.id == device.id) {
            this.selectedDevice = null
        } else {
            this.selectedDevice = device
            this._deviceService.show(device.id).subscribe({
                next: (resp: any) => {
                    this.method = 'update'
                    this.isEditMode = true;
                    this.deviceForm.formGroup.patchValue({
                        user_id: resp.data.user.id,
                        code: resp.data.code,
                        name: resp.data.name,
                        password: resp.data.password,
                        status: resp.data.status
                    }, { emitEvent: false })
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    closeDetails(): void {
        this.selectedDevice = null
        this.isEditMode = false
    }

    update(id: number): void {
        this.deviceForm.submitted = true
        if (this.deviceForm.formGroup.valid) {
            this.deviceForm.submitting = true;
            let deviceUpdate: DeviceUpdate = this.deviceForm.formGroup.getRawValue();
            this._deviceService.update(id, deviceUpdate).subscribe({
                next: (resp: any) => {
                    this.deviceTable.reload.next()
                    this.closeDetails()
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    cancelEdit() {
        if (this.selectedDevice) {
            this.deviceForm.formGroup.patchValue({
                user_id: this.selectedDevice.user_id,
                code: this.selectedDevice.code,
                name: this.selectedDevice.name,
                password: this.selectedDevice.password,
                status: this.selectedDevice.status
            }, { emitEvent: false })
        }
        this.isEditMode = false;
    }

    delete(id: number): void {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._deviceService.delete(id).subscribe({
                        next: (resp) => {
                            this.deviceTable.reload.next()
                            this.method = this.totalItems === 0 ? "store" : "update"
                        }, error: (error) => {
                            console.log(error)
                        }
                    })
                }
            });
        }
    }

    onOpenedChange(event: any, select: string) {
        if (event) {
            this[select].panel.nativeElement.addEventListener(
                'scroll',
                (event: any) => {
                    if (
                        this[select].panel.nativeElement.scrollTop ===
                        this[select].panel.nativeElement.scrollHeight -
                        this[select].panel.nativeElement.offsetHeight
                    ) {
                        const nextPage: number = this.pageNumberUserSelect$.value + 1;
                        this.pageNumberUserSelect$.next(nextPage);
                    }
                }
            );
        }
    }
}
