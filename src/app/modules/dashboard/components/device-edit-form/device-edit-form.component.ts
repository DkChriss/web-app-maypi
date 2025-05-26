import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeviceService } from '../../services/device.service';
import { DeviceUpdate } from '../../models/device';

@Component({
    selector: 'app-device-edit-form',
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
    templateUrl: './device-edit-form.component.html',
    styleUrl: './device-edit-form.component.scss'
})
export class DeviceEditFormComponent implements OnInit {

    current_user = JSON.parse(localStorage.getItem("user"));

    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(this.current_user.id),
            name: new FormControl<string>('', Validators.required),
            code: new FormControl<string>('', Validators.required),
            password: new FormControl<string>(''),
            status: new FormControl<boolean>(false)
        })
    }

    get Form() {
        return this.form.formGroup.controls;
    }

    constructor(
        public dialogRef: MatDialogRef<DeviceEditFormComponent>,
        private _deviceService: DeviceService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    ngOnInit(): void {
        this.form.formGroup.patchValue({
            user_id: this.current_user.id,
            name: this.data.device.name,
            code: this.data.device.code,
            password: '',
            status: this.data.device.status
        })
    }

    formSubmit(): void {
        this.form.submitted = true;
        if (this.form.formGroup.valid) {
            this.form.submitting = true;
            let deviceUpdate: DeviceUpdate = this.form.formGroup.getRawValue();
            deviceUpdate.user_id = this.current_user.id;
            this._deviceService.update(this.data.device.id, deviceUpdate).subscribe({
                next: () => this.dialogRef.close(),
                error: (error) => console.log(error)
            });
        }
    }

}
