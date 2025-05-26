import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EmergencyContactService } from '../../services/emergency-contact.service';
import { EmergencyContactStore } from '../../models/emergency-contact';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-emergency-contact-register-form',
    standalone: true,
    imports: [
        MatDialogModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        CommonModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSelectModule
    ],
    templateUrl: './emergency-contact-register-form.component.html',
    styleUrl: './emergency-contact-register-form.component.scss'
})
export class EmergencyContactRegisterFormComponent {

    current_user: any = JSON.parse(localStorage.getItem('user') || '{}');

    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(this.current_user.id),
            name: new FormControl<string>('', Validators.required),
            line: new FormControl<string>('', Validators.required),
            phone: new FormControl<number>(null, Validators.required),
        })
    }

    get Form() {
        return this.form.formGroup.controls;
    }

    constructor(
        private dialogRef: MatDialogRef<EmergencyContactRegisterFormComponent>,
        private _emergencyContactService: EmergencyContactService
    ) { }

    formSubmit() {
        this.form.submitted = true;
        if (this.form.formGroup.valid) {
            this.form.submitting = true;
            let newEmergencyContact: EmergencyContactStore = this.form.formGroup.getRawValue();
            newEmergencyContact.user_id = this.current_user.id
            this._emergencyContactService.store(newEmergencyContact).subscribe({
                next: (res: any) => this.dialogRef.close(),
                error: (error) => console.log(error)

            })
        }
    }
}
