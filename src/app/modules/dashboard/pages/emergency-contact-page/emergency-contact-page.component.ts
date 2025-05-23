import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { EmergencyContact, EmergencyContactStore, EmergencyContactUpdate } from '../../models/emergency-contact';
import { EmergencyContactService } from '../../services/emergency-contact.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

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
export class EmergencyContactPageComponent implements OnInit, OnDestroy {
    @ViewChild('select_1', { static: false }) select_1: MatSelect;
    current_user: any = JSON.parse(localStorage.getItem('user') || '{}');
    configForm: UntypedFormGroup;
    isLoading = false;
    isEditMode = false;
    selectEmergencyContact: EmergencyContact | null = null
    method = 'store'
    emergencyContactForm = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(this.current_user.id),
            name: new FormControl<string>('', Validators.required),
            line: new FormControl<string>('', Validators.required),
            phone: new FormControl<number>(null, Validators.required),
        })
    }

    emergencyContactTable = {
        reload: new BehaviorSubject<void>(null)
    }

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    totalItems = 0
    emergencyContacts: any


    emergencyContactList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.emergencyContactTable.reload
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this._emergencyContactService.list(
            parseInt(this.pageNumber$.value.toString()),
            parseInt(this.pageSize$.value.toString())
        ).pipe(
            tap((res: any) => {
                this.totalItems = res.total
                this.emergencyContacts = res.data
                this.isLoading = false
            })
        ))
    )


    constructor(
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

    ngOnDestroy(): void {

    }

    openStore(): void {
        this.emergencyContactForm.formGroup.reset()
        this.closeDetails()
        this.isEditMode = true;
        let newEmergencyContact: EmergencyContact = {
            id: this.emergencyContacts[0]["id"],
            user_id: this.current_user.id,
            name: 'name',
            line: 'line',
            phone: 0
        }
        this.method = 'store'
        this.selectEmergencyContact = newEmergencyContact
    }

    store(): void {
        this.emergencyContactForm.submitted = true
        if (this.emergencyContactForm.formGroup.valid) {
            this.emergencyContactForm.submitting = true
            const newEmergencyContact: EmergencyContactStore = this.emergencyContactForm.formGroup.getRawValue()
            newEmergencyContact.user_id = this.current_user.id
            this._emergencyContactService.store(newEmergencyContact).subscribe({
                next: (resp: any) => {
                    this.emergencyContactTable.reload.next();
                    this.closeDetails();
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    toggleDetails(emergencyContact: EmergencyContact): void {
        this.isEditMode = !this.isEditMode
        if (this.selectEmergencyContact?.id == emergencyContact.id) {
            this.selectEmergencyContact = null
        } else {
            this.selectEmergencyContact = emergencyContact
            this._emergencyContactService.show(emergencyContact.id).subscribe({
                next: (resp: any) => {
                    this.method = 'update'
                    this.isEditMode = true;
                    this.emergencyContactForm.formGroup.patchValue({
                        user_id: resp.data.user_id,
                        name: resp.data.name,
                        line: resp.data.line,
                        phone: resp.data.phone
                    }, { emitEvent: false })
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    closeDetails(): void {
        this.selectEmergencyContact = null
        this.isEditMode = false
    }

    update(id: number): void {
        this.emergencyContactForm.submitted = true
        if (this.emergencyContactForm.formGroup.valid) {
            this.emergencyContactForm.submitting = true;
            let emergencyContactUpdate: EmergencyContactUpdate = this.emergencyContactForm.formGroup.getRawValue();
            emergencyContactUpdate.user_id = this.current_user.id
            this._emergencyContactService.update(id, emergencyContactUpdate).subscribe({
                next: (resp: any) => {
                    this.emergencyContactTable.reload.next()
                    this.closeDetails()
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    cancelEdit() {
        if (this.selectEmergencyContact) {
            this.emergencyContactForm.formGroup.patchValue({
                user_id: this.selectEmergencyContact.user_id,
                name: this.selectEmergencyContact.name,
                line: this.selectEmergencyContact.line,
                phone: this.selectEmergencyContact.phone
            }, { emitEvent: false })
            this.selectEmergencyContact = null
        }
        this.isEditMode = false;
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
}
