import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MissingService } from '../../services/missing.service';

@Component({
    selector: 'app-missing-change-status-form',
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
    ],
    templateUrl: './missing-change-status-form.component.html',
    styleUrl: './missing-change-status-form.component.scss',
})
export class MissingChangeStatusFormComponent {
    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            status_missing: new FormControl<string>('', Validators.required),
        }),
    };
    get Form() {
        return this.form.formGroup.controls;
    }
    constructor(
        private dialogRef: MatDialogRef<MissingChangeStatusFormComponent>,
        private _missingService: MissingService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    formSubmit(): void {
        this.form.submitted = true;
        if (this.form.formGroup.valid) {
            let formData: any = this.form.formGroup.getRawValue();
            let id = this.data.id;
            this._missingService.change(id, formData).subscribe({
                next: () => this.dialogRef.close(),
                error: (error) => console.log(error),
            });
        }
    }
}
