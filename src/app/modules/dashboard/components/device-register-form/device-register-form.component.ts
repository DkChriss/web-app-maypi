import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeviceService } from '../../services/device.service';
import { DeviceStore } from '../../models/device';

@Component({
    selector: 'app-device-register-form',
    standalone: true,
    imports: [
        MatDialogModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        CommonModule,
        MatButtonModule,
        ReactiveFormsModule
    ],
    templateUrl: './device-register-form.component.html',
    styleUrl: './device-register-form.component.scss'
})
export class DeviceRegisterFormComponent {


    current_user = JSON.parse(localStorage.getItem("user"));

    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(this.current_user.id),
            name: new FormControl<string>('', Validators.required),
            code: new FormControl<string>('', Validators.required),
            password: new FormControl<string>('', Validators.required),
            status: new FormControl<boolean>(false)
        })
    }

    get Form() {
        return this.form.formGroup.controls;
    }

    constructor(
        public dialogRef: MatDialogRef<DeviceRegisterFormComponent>,
        private _deviceService: DeviceService
    ) { }

    formSubmit() {
        this.form.submitted = true;
        if (this.form.formGroup.valid) {
            this.form.submitting = true;
            let newDevice: DeviceStore = this.form.formGroup.getRawValue();
            newDevice.user_id = this.current_user.id
            this._deviceService.store(newDevice).subscribe({
                next: (res: any) => this.dialogRef.close(),
                error: (error) => console.log(error)

            })
        }
    }

}
