import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import {
    BehaviorSubject,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap,
} from 'rxjs';
import { ReportService } from '../../services/report.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ReportRegisterFormComponent } from '../../components/report-register-form/report-register-form.component';
import { Report } from '../../models/report';
import { ReportEditFormComponent } from '../../components/report-edit-form/report-edit-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { QuillModule } from 'ngx-quill';

@Component({
    selector: 'app-report-page',
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
    templateUrl: './report-page.component.html',
    styleUrl: './report-page.component.scss',
})
export class ReportPageComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = [
        'name',
        'email',
        'phone',
        'location',
        'description',
        'date',
        'actions',
    ];
    configForm: UntypedFormGroup;
    isLoading = true;

    reportTable = {
        reload: new BehaviorSubject<void>(null),
    };

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    searchBy$ = new BehaviorSubject<string>('');
    totalItems = 0;

    reportList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.searchBy$,
        this.reportTable.reload,
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() =>
            this._reportService
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

    constructor(
        private dialog: MatDialog,
        private _reportService: ReportService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder
    ) {}

    store(): void {
        const dialogRef = this.dialog.open(ReportRegisterFormComponent, {
            width: '70%',
            height: 'auto',
            disableClose: false,
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.reportTable.reload.next();
        });
    }

    update(report: Report): void {
        const dialogRef = this.dialog.open(ReportEditFormComponent, {
            width: '70%',
            height: 'auto',
            disableClose: false,
            data: {
                report: report,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.reportTable.reload.next();
        });
    }

    delete(id: number) {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open(
                this.configForm.value
            );

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._reportService.delete(id).subscribe({
                        next: (resp) => {
                            this.reportTable.reload.next();
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
}
