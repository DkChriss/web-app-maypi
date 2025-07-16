import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/user.service';
import { StatusEnum, UserStore } from '../../models/user';

@Component({
    selector: 'app-user-register-form',
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
    templateUrl: './user-register-form.component.html',
    styleUrl: './user-register-form.component.scss',
})
export class UserRegisterFormComponent {
    status: StatusEnum;
    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            code: new FormControl<string>('', Validators.required),
            name: new FormControl<string>('', Validators.required),
            last_name: new FormControl<string>('', Validators.required),
            second_surname: new FormControl<string>('', Validators.required),
            email: new FormControl<string>('', [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl<string>('', [Validators.required]),
            user_status: new FormControl<StatusEnum>(
                StatusEnum.online,
                Validators.required
            ),
            phone: new FormControl<number>(null, Validators.required),
            avatar: new FormControl<File>(null, Validators.required),
            token_firebase: new FormControl<string>(null, []),
        }),
    };

    constructor(
        public dialogRef: MatDialogRef<UserRegisterFormComponent>,
        private _userService: UserService
    ) {}

    get Form() {
        return this.form.formGroup.controls;
    }

    buildUserStoreFormData(data: UserStore): FormData {
        const formData = new FormData();
        formData.append('code', data.code);
        formData.append('name', data.name);
        formData.append('last_name', data.last_name);
        formData.append('second_surname', data.second_surname);
        formData.append('email', data.email);
        formData.append('user_status', StatusEnum.online);
        formData.append('phone', data.phone.toString());
        formData.append('token_firebase', data.token_firebase);
        formData.append('password', data.password);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        return formData;
    }

    formSubmit(): void {
        this.form.submitted = true;
        if (this.form.formGroup.valid) {
            this.form.submitting = true;
            let newUser: UserStore = this.form.formGroup.getRawValue();
            let newUserFormData: FormData =
                this.buildUserStoreFormData(newUser);
            this._userService.store(newUserFormData).subscribe({
                next: (res: any) => this.dialogRef.close(),
                error: (error) => console.log(error),
            });
        }
    }

    onFileChange(event: Event, field: string) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.form.formGroup.patchValue({ [field]: input.files[0] });
        }
    }
}
