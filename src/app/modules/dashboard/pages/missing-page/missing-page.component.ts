import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissingService } from '../../services/missing.service';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
    BehaviorSubject,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap,
} from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { QuillModule } from 'ngx-quill';
import { Missing, StatusMissingEnum } from '../../models/missing';
import { MissingRegisterFormComponent } from '../../components/missing-register-form/missing-register-form.component';
import { MissingEditFormComponent } from '../../components/missing-edit-form/missing-edit-form.component';
import { MissingChangeStatusFormComponent } from '../../components/missing-change-status-form/missing-change-status-form.component';
import { MissingImageModalComponent } from '../../components/missing-image-modal/missing-image-modal.component';

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
        MatSelectModule,
    ],
    templateUrl: './missing-page.component.html',
    styleUrl: './missing-page.component.scss',
})
export class MissingPageComponent implements OnInit, OnDestroy {
    statusLabel: { [key: string]: string } = {
        pending: 'Pendiente',
        progress: 'En Progreso',
        suspended: 'Suspendido',
        resumed: 'Reanudado',
        completed: 'Completado',
    };
    displayedColumns: string[] = [
        'name',
        'location',
        'phone',
        'status_missing',
        'actions',
    ];
    configForm: UntypedFormGroup;
    isLoading = true;

    missingTable = {
        reload: new BehaviorSubject<void>(null),
    };

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    searchBy$ = new BehaviorSubject<string>('');
    totalItems = 0;

    missingList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.searchBy$,
        this.missingTable.reload,
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() =>
            this._missingService
                .list(
                    parseInt(this.pageNumber$.value.toString()),
                    parseInt(this.pageSize$.value.toString()),
                    this.searchBy$.value
                )
                .pipe(
                    tap((res: any) => {
                        this.totalItems = res.total;
                        this.isLoading = false;
                    }),
                    map((res: any) => res.data)
                )
        )
    );

    constructor(
        private dialog: MatDialog,
        private _missingService: MissingService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.isLoading = false;
        this.configForm = this._formBuilder.group({
            title: 'Eliminar reporte de desaparicion',
            message:
                'Esta seguro de eliminar el reporte de desaparicion? <span class="font-medium">Esta accion no puede ser reversible!</span>',
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

    ngOnDestroy(): void {}

    store(): void {
        const dialogRef = this.dialog.open(MissingRegisterFormComponent, {
            width: '70%',
            height: 'auto',
            disableClose: false,
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.missingTable.reload.next();
        });
    }

    update(missing: Missing): void {
        const dialogRef = this.dialog.open(MissingEditFormComponent, {
            width: '70%',
            height: 'auto',
            disableClose: false,
            data: {
                missing: missing,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.missingTable.reload.next();
        });
    }

    delete(id: number) {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open(
                this.configForm.value
            );

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._missingService.delete(id).subscribe({
                        next: (resp) => {
                            this.missingTable.reload.next();
                        },
                        error: (error) => {
                            console.log(error);
                        },
                    });
                }
            });
        }
    }

    onPageChange(event) {
        this.pageNumber$.next(event.pageIndex + 1);
        this.pageSize$.next(event.pageSize);
    }

    change(id: number) {
        const dialogRef = this.dialog.open(MissingChangeStatusFormComponent, {
            width: '40%',
            height: 'auto',
            disableClose: false,
            data: {
                id: id,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.missingTable.reload.next();
        });
    }

    showImages(id: number) {
        if (id) {
            this._missingService.showImages(id).subscribe({
                next: (response) => {
                    const dialogRef = this.dialog.open(
                        MissingImageModalComponent,
                        {
                            width: '50%',
                            height: 'auto',
                            disableClose: false,
                            data: {
                                images: response,
                            },
                        }
                    );

                    dialogRef.afterClosed().subscribe((result) => {
                        this.missingTable.reload.next();
                    });
                },
                error: (error) => {
                    console.log(error);
                },
            });
        }
    }
}
