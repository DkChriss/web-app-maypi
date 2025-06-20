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
import { EmergencyContactUpdate } from '../../models/emergency-contact';
import { EmergencyContactService } from '../../services/emergency-contact.service';
import { EmergencyContactRegisterFormComponent } from '../emergency-contact-register-form/emergency-contact-register-form.component';

@Component({
    selector: 'app-emergency-contact-edit-form',
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
    templateUrl: './emergency-contact-edit-form.component.html',
    styleUrl: './emergency-contact-edit-form.component.scss',
})
export class EmergencyContactEditFormComponent implements OnInit {
    current_user = JSON.parse(localStorage.getItem('user'));
    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(this.current_user.id),
            name: new FormControl<string>('', Validators.required),
            line: new FormControl<string>('', Validators.required),
            phone: new FormControl<number>(null, Validators.required),
        }),
    };

    get Form() {
        return this.form.formGroup.controls;
    }
    constructor(
        private dialogRef: MatDialogRef<EmergencyContactRegisterFormComponent>,
        private _emergencyContactService: EmergencyContactService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.form.formGroup.patchValue({
            user_id: this.current_user.id,
            name: this.data.emergencyContact.name,
            line: this.data.emergencyContact.line,
            phone: this.data.emergencyContact.phone,
        });
    }
    formSubmit(): void {
        this.form.submitted = true;
        if (this.form.formGroup.valid) {
            this.form.submitting = true;
            let emergencyContactUpdate: EmergencyContactUpdate =
                this.form.formGroup.getRawValue();
            emergencyContactUpdate.user_id = this.current_user.id;
            this._emergencyContactService
                .update(this.data.emergencyContact.id, emergencyContactUpdate)
                .subscribe({
                    next: () => this.dialogRef.close(),
                    error: (error) => console.log(error),
                });
        }
    }
}
