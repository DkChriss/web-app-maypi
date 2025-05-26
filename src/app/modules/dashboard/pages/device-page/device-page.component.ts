import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Device, DeviceStore, DeviceUpdate } from '../../models/device';
import { DeviceService } from '../../services/device.service';
import { UntypedFormGroup, FormGroup, FormControl, Validators, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { QuillModule } from 'ngx-quill';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DeviceRegisterFormComponent } from '../../components/device-register-form/device-register-form.component';
import { DeviceEditFormComponent } from '../../components/device-edit-form/device-edit-form.component';

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
        MatCheckboxModule
    ],
    templateUrl: './device-page.component.html',
    styleUrl: './device-page.component.scss'
})
export class DevicePageComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = ['name', 'code', 'status', 'actions'];

    isLoading = true
    configForm: UntypedFormGroup;


    deviceTable = {
        reload: new BehaviorSubject<void>(null)
    }

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    searchBy$ = new BehaviorSubject<string>('');
    totalItems = 0

    deviceList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.searchBy$,
        this.deviceTable.reload
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this._deviceService.list(
            parseInt(this.pageNumber$.value.toString()),
            parseInt(this.pageSize$.value.toString()),
            this.searchBy$.value
        ).pipe(
            tap((res: any) => {
                this.totalItems = res.total
            }),
            map((res: any) => res.data)
        ))
    )

    constructor(
        private dialog: MatDialog,
        private _deviceService: DeviceService,
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

    store(): void {
        const dialogRef = this.dialog.open(DeviceRegisterFormComponent, {
            width: '600px',
            height: 'auto',
            disableClose: false
        })

        dialogRef.afterClosed().subscribe(result => {
            this.deviceTable.reload.next();
        })
    }

    edit(device: Device): void {
        const dialogRef = this.dialog.open(DeviceEditFormComponent, {
            width: '600px',
            height: 'auto',
            disableClose: false,
            data: {
                device: device
            }
        })

        dialogRef.afterClosed().subscribe(result => {
            this.deviceTable.reload.next();
        })

    }


    delete(id: number): void {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._deviceService.delete(id).subscribe({
                        next: (resp) => {
                            this.deviceTable.reload.next()
                        }, error: (error) => {
                            console.log(error)
                        }
                    })
                }
            });
        }
    }

    onPageChange(event) {
        this.pageNumber$.next(event.pageIndex + 1)
        this.pageSize$.next(event.pageSize)
    }
}
