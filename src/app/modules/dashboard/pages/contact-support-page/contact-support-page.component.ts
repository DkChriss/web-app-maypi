import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactSupport, ContactSupportStore, ContactSupportUpdate } from '../../models/contact-support';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { ContactSupportService } from '../../services/contact-support.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { QuillModule } from 'ngx-quill';

@Component({
    selector: 'app-contact-support-page',
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
    templateUrl: './contact-support-page.component.html',
    styleUrl: './contact-support-page.component.scss'
})
export class ContactSupportPageComponent implements OnInit, OnDestroy {

    configForm: UntypedFormGroup;
    current_user: any = JSON.parse(localStorage.getItem('user') || '{}');
    isLoading = false;
    isEditMode = false;
    selectContactSupport: ContactSupport | null = null
    method = 'store'
    contactSupportForm = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(this.current_user.id),
            name: new FormControl<string>('', Validators.required),
            email: new FormControl<string>('', [Validators.required, Validators.email]),
            title: new FormControl<string>('', Validators.required),
            message: new FormControl<string>('', Validators.required)
        })
    }

    contactSupportTable = {
        reload: new BehaviorSubject<void>(null)
    }

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    totalItems = 0
    contactsSupport: any

    contactSupportList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.contactSupportTable.reload
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this._contactSupportService.list(
            parseInt(this.pageNumber$.value.toString()),
            parseInt(this.pageSize$.value.toString())
        ).pipe(
            tap((res: any) => {
                this.totalItems = res.total
                this.contactsSupport = res.data
                this.isLoading = false
            })
        ))
    )
    constructor(
        private _contactSupportService: ContactSupportService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder
    ) {

    }

    ngOnInit(): void {
        this.isLoading = false
        this.configForm = this._formBuilder.group({
            title: 'Eliminar el contacto al soporte',
            message: 'Esta seguro de eliminar el contacto al soporte? <span class="font-medium">Esta accion no puede ser reversible!</span>',
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
        this.contactSupportForm.formGroup.reset()
        this.closeDetails()
        this.isEditMode = true;
        let newContactSupport: ContactSupport = {
            id: this.contactsSupport[0]["id"],
            user_id: this.current_user.id,
            name: 'name',
            title: 'title',
            email: 'email@email.com',
            message: 'message'
        }
        this.method = 'store'
        this.selectContactSupport = newContactSupport
    }

    store(): void {
        this.contactSupportForm.submitted = true
        if (this.contactSupportForm.formGroup.valid) {
            this.contactSupportForm.submitting = true
            const newContactSupport: ContactSupportStore = this.contactSupportForm.formGroup.getRawValue()
            newContactSupport.user_id = this.current_user.id
            this._contactSupportService.store(newContactSupport).subscribe({
                next: (resp: any) => {
                    this.contactSupportTable.reload.next();
                    this.closeDetails()
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    toggleDetails(contactSupport: ContactSupport): void {
        this.isEditMode = !this.isEditMode
        if (this.selectContactSupport?.id == contactSupport.id) {
            this.selectContactSupport = null
        } else {
            this.selectContactSupport = contactSupport
            this._contactSupportService.show(contactSupport.id).subscribe({
                next: (resp: any) => {
                    this.method = 'update'
                    this.isEditMode = true;
                    this.contactSupportForm.formGroup.patchValue({
                        user_id: resp.data.user_id,
                        name: resp.data.name,
                        title: resp.data.title,
                        email: resp.data.email,
                        message: resp.data.message

                    }, { emitEvent: false })
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    closeDetails(): void {
        this.selectContactSupport = null
        this.isEditMode = false
    }

    update(id: number): void {
        this.contactSupportForm.submitted = true
        if (this.contactSupportForm.formGroup.valid) {
            this.contactSupportForm.submitting = true;
            const ContactSupportUpdate: ContactSupportUpdate = this.contactSupportForm.formGroup.getRawValue()
            ContactSupportUpdate.user_id = this.current_user.id
            this._contactSupportService.update(id, ContactSupportUpdate).subscribe({
                next: (resp: any) => {
                    this.contactSupportTable.reload.next();
                    this.closeDetails();
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    cancelEdit() {
        if (this.selectContactSupport) {
            this.contactSupportForm.formGroup.patchValue({
                user_id: this.selectContactSupport.user_id,
                name: this.selectContactSupport.name,
                title: this.selectContactSupport.title,
                email: this.selectContactSupport.email,
                message: this.selectContactSupport.message

            }, { emitEvent: false })
        }
        this.isEditMode = false;
    }

    delete(id: number) {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._contactSupportService.delete(id).subscribe({
                        next: (resp) => {
                            this.contactSupportTable.reload.next()
                            this.method = this.totalItems === 0 ? "store" : "update"
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
