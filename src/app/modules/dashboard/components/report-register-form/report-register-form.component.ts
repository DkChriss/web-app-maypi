import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormGroup,
    FormControl,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ReportService } from '../../services/report.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReportStore } from '../../models/report';
import {
    BehaviorSubject,
    combineLatest,
    distinctUntilChanged,
    switchMap,
    tap,
} from 'rxjs';
import { MissingService } from '../../services/missing.service';

@Component({
    selector: 'app-report-register-form',
    standalone: true,
    imports: [
        MatDialogModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        CommonModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatDatepickerModule,
    ],
    templateUrl: './report-register-form.component.html',
    styleUrl: './report-register-form.component.scss',
})
export class ReportRegisterFormComponent {
    @ViewChild('select_1', { static: false }) select_1: MatSelect;

    current_user = JSON.parse(localStorage.getItem('user'));

    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            missing_id: new FormControl<number>(null, Validators.required),
            user_id: new FormControl<number>(null),
            name: new FormControl<string>('', Validators.required),
            email: new FormControl<string>('', {
                validators: [Validators.required, Validators.email],
            }),
            phone: new FormControl<string>('', {
                validators: [Validators.required],
            }),
            location: new FormControl<string>('', {
                validators: [Validators.required],
            }),
            description: new FormControl<string>('', Validators.required),
            date: new FormControl<Date>(null, Validators.required),
        }),
    };

    get Form() {
        return this.form.formGroup.controls;
    }

    //Missing
    pageSizeMissingSelect$ = new BehaviorSubject<number>(10);
    pageNumberMissingSelect$ = new BehaviorSubject<number>(1);
    missing: any = [];
    canLoadMore: boolean = false;

    missingSelect = {
        reload: new BehaviorSubject<void>(null),
    };

    missingSelectList$ = combineLatest([
        this.pageSizeMissingSelect$,
        this.pageNumberMissingSelect$,
        this.missingSelect.reload,
    ]).pipe(
        distinctUntilChanged(),
        switchMap(() =>
            this._missingService
                .list(
                    parseInt(this.pageNumberMissingSelect$.value.toString()),
                    parseInt(this.pageSizeMissingSelect$.value.toString())
                )
                .pipe(
                    tap((res: any) => {
                        this.canLoadMore = res.links.next !== null;
                        if (this.missing.length === 0) {
                            this.missing = res.data;
                        } else {
                            res.data.forEach((element) => {
                                if (
                                    !this.missing.some(
                                        (user) => user.id === element.id
                                    )
                                ) {
                                    this.missing.push(element);
                                }
                            });
                        }
                    })
                )
        )
    );

    constructor(
        public dialogRef: MatDialogRef<ReportRegisterFormComponent>,
        private _reportService: ReportService,
        private _missingService: MissingService
    ) {}

    formSubmit() {
        this.form.submitted = true;
        if (this.form.formGroup.valid) {
            this.form.submitting = true;
            let newReport: ReportStore = this.form.formGroup.getRawValue();
            newReport.user_id =
                this.current_user.id != null ? this.current_user.id : null;
            this._reportService.store(newReport).subscribe({
                next: (res: any) => this.dialogRef.close(),
                error: (error) => console.log(error),
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
                        const nextPage: number =
                            this.pageNumberMissingSelect$.value + 1;
                        this.pageNumberMissingSelect$.next(nextPage);
                    }
                }
            );
        }
    }
}
