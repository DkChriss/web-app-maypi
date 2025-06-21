import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissingService } from '../../services/missing.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MissingStore, StatusMissingEnum } from '../../models/missing';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'app-missing-register-form',
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
        MatDatepickerModule
    ],
    templateUrl: './missing-register-form.component.html',
    styleUrl: './missing-register-form.component.scss'
})
export class MissingRegisterFormComponent {

    current_user: any = JSON.parse(localStorage.getItem('user') || '{}');

    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(this.current_user.id, Validators.required),
            name: new FormControl<string>('', Validators.required),
            last_name: new FormControl<string>('', Validators.required),
            age: new FormControl<number>(null, Validators.required),
            gender: new FormControl<string>('', Validators.required),
            description: new FormControl<string>('', Validators.required),
            birthdate: new FormControl<Date>(null, Validators.required),
            disappearance_date: new FormControl<Date>(null, Validators.required),
            place_of_disappearance: new FormControl<string>('', Validators.required),
            status_missing: new FormControl<StatusMissingEnum>(StatusMissingEnum.pending, Validators.required),
            photo: new FormControl<File>(null, Validators.required),
            characteristics: new FormControl<string>('', Validators.required),
            reporter_name: new FormControl<string>('', Validators.required),
            reporter_phone: new FormControl<string>('', Validators.required),
            event_photo: new FormControl<File>(null, Validators.required)
        })
    }

    constructor(
        public dialogRef: MatDialogRef<MissingRegisterFormComponent>,
        private _missingService: MissingService
    ) {
    }

    get Form() {
        return this.form.formGroup.controls;
    }

    buildMissingStoreFormData(data: MissingStore): FormData {
        const formData = new FormData();

        formData.append('birthdate', new Date(data.birthdate).toISOString().split('T')[0]);
        formData.append('disappearance_date', new Date(data.disappearance_date).toISOString().split('T')[0]);
        formData.append('user_id', String(data.user_id));
        formData.append('name', data.name);
        formData.append('last_name', data.last_name);
        formData.append('age', String(data.age));
        formData.append('gender', data.gender);
        formData.append('description', data.description);
        formData.append('place_of_disappearance', data.place_of_disappearance);
        formData.append('status_missing', data.status_missing);
        formData.append('characteristics', data.characteristics);
        formData.append('reporter_name', data.reporter_name);
        formData.append('reporter_phone', data.reporter_phone);

        if (data.photo) {
            formData.append('photo', data.photo);
        }
        if (data.event_photo) {
            formData.append('event_photo', data.event_photo);
        }

        return formData;
    }

    formSubmit(): void {
        this.form.submitted = true
        if (this.form.formGroup.valid) {
            this.form.submitting = true
            let newMissing: MissingStore = this.form.formGroup.getRawValue();
            newMissing.user_id = this.current_user.id
            const newMissingFormData: FormData = this.buildMissingStoreFormData(newMissing)
            this._missingService.store(newMissingFormData).subscribe({
                next: (res: any) => this.dialogRef.close(),
                error: (error) => console.log(error)
            })
        }
    }

    onFileChange(event: Event, field: string) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.form.formGroup.patchValue({ [field]: input.files[0] });
        }
    }
}

