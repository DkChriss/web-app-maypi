import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissingService } from '../../services/missing.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { QuillModule } from 'ngx-quill';
import { Missing, MissingStore, MissingUpdate, StatusMissingEnum } from '../../models/missing';

@Component({
    selector: 'app-missing-page',
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
        MatSelectModule
    ],
    templateUrl: './missing-page.component.html',
    styleUrl: './missing-page.component.scss'
})
export class MissingPageComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['name', 'location', 'phone', 'status_missing', 'actions'];
    configForm: UntypedFormGroup;
    isLoading = true
    isEditMode = false
    selectedMissing: Missing | null = null
    method = 'store'
    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(null, Validators.required),
            name: new FormControl<string>('', Validators.required),
            last_name: new FormControl<string>('', Validators.required),
            age: new FormControl<number>(null, Validators.required),
            gender: new FormControl<string>('', Validators.required),
            description: new FormControl<string>('', Validators.required),
            birthdate: new FormControl<Date>(null, Validators.required),
            disappearance_date: new FormControl<Date>(null, Validators.required),
            place_of_disappearance: new FormControl<string>('', Validators.required),
            status_missing: new FormControl<StatusMissingEnum>(null, Validators.required),
            characteristics: new FormControl<string>('', Validators.required),
            reporter_name: new FormControl<string>('', Validators.required),
            reporter_phone: new FormControl<string>('', Validators.required),
            location: new FormControl<any>(null, Validators.required)
        })
    }

    missingTable = {
        reload: new BehaviorSubject<void>(null)
    }

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    searchBy$ = new BehaviorSubject<string>('');
    totalItems = 0
    missing: any

    missingList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.searchBy$,
        this.missingTable.reload
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this._missingService.list(
            parseInt(this.pageNumber$.value.toString()),
            parseInt(this.pageSize$.value.toString()),
            this.searchBy$.value
        ).pipe(
            tap((res: any) => {
                this.totalItems = res.total;
                this.missing = res.data
                this.isLoading = false
            }),
            map((res: any) => res.data)
        ))
    )

    constructor(
        private _missingService: MissingService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
    ) { }

    ngOnInit(): void {
        this.isLoading = false
        this.configForm = this._formBuilder.group({
            title: 'Eliminar reporte de desaparicion',
            message: 'Esta seguro de eliminar el reporte de desaparicion? <span class="font-medium">Esta accion no puede ser reversible!</span>',
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
        this.form.formGroup.reset()
        this.closeDetails();
        this.isEditMode = true;
        let newMissing: Missing = {
            id: this.missing[0]["id"],
            user_id: 1,
            name: 'name',
            last_name: 'last_name',
            age: 0,
            gender: 'gender',
            description: 'description',
            birthdate: new Date(),
            disappearance_date: new Date(),
            place_of_disappearance: 'place of disappearance',
            status_missing: StatusMissingEnum.pending,
            characteristics: "characteristics",
            reporter_name: "reporter_name",
            reporter_phone: "reporter_phone",
            location: {
                latitude: "1,203923",
                longitude: "1,2309832"
            }

        }
        this.method = 'store'
        this.selectedMissing = newMissing

    }

    store(): void {
        this.form.submitted = true
        if (this.form.formGroup.valid) {
            this.form.submitting = true
            const newMissing: MissingStore = this.form.formGroup.getRawValue();
            this._missingService.store(newMissing).subscribe({
                next: (resp: any) => {
                    this.missingTable.reload.next();
                    this.closeDetails();
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }


    closeDetails(): void {
        this.selectedMissing = null
        this.isEditMode = false
    }

    toggleDetails(missing: Missing): void {
        this.isEditMode = !this.isEditMode
        if (this.selectedMissing?.id == missing.id) {
            this.selectedMissing = null
        } else {
            this.selectedMissing = missing
            this._missingService.show(missing.id).subscribe({
                next: (resp: any) => {
                    this.method = 'update'
                    this.isEditMode = true;
                    this.form.formGroup.patchValue({
                        user_id: resp.data.user_id,
                        name: resp.data.name,
                        last_name: resp.data.last_name,
                        age: resp.data.age,
                        gender: resp.data.gender,
                        description: resp.data.description,
                        birthdate: resp.data.birthdate,
                        disappearance_date: resp.data.disappearance_date,
                        place_of_disappearance: resp.data.place_of_disappearance,
                        status_missing: resp.data.status_missing,
                        characteristics: resp.data.characteristics,
                        reporter_name: resp.data.reporter_name,
                        reporter_phone: resp.data.reporter_phone,
                        location: resp.data.location
                    }, { emitEvent: false })
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    update(id: number): void {
        this.form.submitted = true
        if (this.form.formGroup.valid) {
            this.form.submitting = true
            const missingUpdate: MissingUpdate = this.form.formGroup.getRawValue()
            this._missingService.update(id, missingUpdate).subscribe({
                next: (resp: any) => {
                    this.missingTable.reload.next();
                    this.closeDetails();
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    cancelEdit() {
        if (this.selectedMissing) {
            this.form.formGroup.patchValue({
                user_id: this.selectedMissing.user_id,
                name: this.selectedMissing.name,
                last_name: this.selectedMissing.last_name,
                age: this.selectedMissing.age,
                gender: this.selectedMissing.gender,
                description: this.selectedMissing.description,
                birthdate: this.selectedMissing.birthdate,
                disappearance_date: this.selectedMissing.disappearance_date,
                place_of_disappearance: this.selectedMissing.place_of_disappearance,
                status_missing: this.selectedMissing.status_missing,
                characteristics: this.selectedMissing.characteristics,
                reporter_name: this.selectedMissing.reporter_name,
                reporter_phone: this.selectedMissing.reporter_phone,
                location: this.selectedMissing.location
            }, { emitEvent: false })
        }
        this.isEditMode = false;
    }

    delete(id: number) {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._missingService.delete(id).subscribe({
                        next: (resp) => {
                            this.missingTable.reload.next()
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
