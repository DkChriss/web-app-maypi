import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EmergencyContactRegisterFormComponent } from '../emergency-contact-register-form/emergency-contact-register-form.component';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MissingUpdate, StatusMissingEnum } from '../../models/missing';
import { MissingService } from '../../services/missing.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-missig-edit-form',
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
  templateUrl: './missing-edit-form.component.html',
  styleUrl: './missing-edit-form.component.scss'
})
export class MissingEditFormComponent implements OnInit{

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
            photo: new FormControl<File>(null),
            characteristics: new FormControl<string>('', Validators.required),
            reporter_name: new FormControl<string>('', Validators.required),
            reporter_phone: new FormControl<string>('', Validators.required),
            event_photo: new FormControl<File>(null)
        })
    }
    get Form() {
        return this.form.formGroup.controls;
    }

    constructor(
        private dialogRef: MatDialogRef<EmergencyContactRegisterFormComponent>,
        private _missingService: MissingService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.loadForm();
    }

    loadForm(): void {
        this.form.formGroup.patchValue(this.data.missing)
    }

    buildMissingStoreFormData(data: MissingUpdate): FormData {
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
    formSubmit() :void {
        this.form.submitted = true
        if (this.form.formGroup.valid) {
            this.form.submitting = true
            let updateMissing: MissingUpdate = this.form.formGroup.getRawValue();
            updateMissing.user_id = this.current_user.id
            const updateMissingFormData: FormData = this.buildMissingStoreFormData(updateMissing)
            this._missingService.update(this.data.missing.id, updateMissingFormData).subscribe({
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
