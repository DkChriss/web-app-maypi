import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { EmergencyContact, EmergencyContactStore, EmergencyContactUpdate } from '../../models/emergency-contact';
import { EmergencyContactService } from '../../services/emergency-contact.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { EmergencyContactRegisterFormComponent } from '../../components/emergency-contact-register-form/emergency-contact-register-form.component';
import { EmergencyContactEditFormComponent } from '../../components/emergency-contact-edit-form/emergency-contact-edit-form.component';

@Component({
    selector: 'app-emergency-contact-page',
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
    templateUrl: './emergency-contact-page.component.html',
    styleUrl: './emergency-contact-page.component.scss'
})
export class EmergencyContactPageComponent implements OnInit {

    displayedColumns: string[] = ['name', 'phone', 'line', 'actions'];

    configForm: UntypedFormGroup;
    isLoading = true

    emergencyContactTable = {
        reload: new BehaviorSubject<void>(null)
    }

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    searchBy$ = new BehaviorSubject<string>('');
    totalItems = 0

    emergencyContactList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.searchBy$,
        this.emergencyContactTable.reload
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this._emergencyContactService.list(
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
        private _emergencyContactService: EmergencyContactService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
    ) { }

    ngOnInit(): void {
        this.isLoading = false
        this.configForm = this._formBuilder.group({
            title: 'Eliminar Contacto de Emergencia',
            message: 'Esta seguro de eliminar el contacto de emergencia? <span class="font-medium">Esta accion no puede ser reversible!</span>',
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

    store(): void {
        const dialogRef = this.dialog.open(EmergencyContactRegisterFormComponent, {
            width: '600px',
            height: 'auto',
            disableClose: false
        })

        dialogRef.afterClosed().subscribe(result => {
            this.emergencyContactTable.reload.next();
        })
    }

    edit(emergencyContact: EmergencyContact): void {
        const dialogRef = this.dialog.open(EmergencyContactEditFormComponent, {
            width: '600px',
            height: 'auto',
            disableClose: false,
            data: {
                emergencyContact: emergencyContact
            }
        })

        dialogRef.afterClosed().subscribe(result => {
            this.emergencyContactTable.reload.next();
        })
    }

    delete(id: number): void {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._emergencyContactService.delete(id).subscribe({
                        next: (resp) => {
                            this.emergencyContactTable.reload.next()
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
