import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { PublicService } from 'app/modules/landing/home/services/public.service';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [
        fuseAnimations,
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('600ms ease-in', style({ opacity: 1 })),
            ]),
        ]),
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateY(20px)', opacity: 0 }),
                animate(
                    '400ms ease-out',
                    style({ transform: 'translateY(0)', opacity: 1 })
                ),
            ]),
        ]),
        trigger('shake', [
            transition('* => error', [
                style({ transform: 'translateX(0)' }),
                animate('100ms', style({ transform: 'translateX(-10px)' })),
                animate('100ms', style({ transform: 'translateX(10px)' })),
                animate('100ms', style({ transform: 'translateX(-10px)' })),
                animate('100ms', style({ transform: 'translateX(10px)' })),
                animate('100ms', style({ transform: 'translateX(0)' })),
            ]),
        ]),
    ],
    standalone: true,
    imports: [
        RouterLink,
        NgIf,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatOptionModule,
    ],
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm = {
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
            phone: new FormControl<number>(null, Validators.required),
            avatar: new FormControl<File>(null),
        }),
    };
    get Form() {
        return this.signUpForm.formGroup.controls;
    }

    onFileChange(event: Event, field: string) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.signUpForm.formGroup.patchValue({ [field]: input.files[0] });
        }
    }
    showAlert: boolean = false;
    isLoading: boolean = false;

    // Lista de líneas telefónicas
    roles = [
        { id: 1, name: 'Entel' },
        { id: 2, name: 'Viva' },
        { id: 3, name: 'Tigo' },
    ];
    image: File | null = null;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _publicService: PublicService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {}

    // Método para manejar la carga de la imagen
    buildUserStoreFormData(data: any): FormData {
        const formData = new FormData();
        formData.append('code', data.code);
        formData.append('name', data.name);
        formData.append('last_name', data.last_name);
        formData.append('second_surname', data.second_surname);
        formData.append('email', data.email);
        formData.append('phone', data.phone.toString());
        formData.append('password', data.password);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        return formData;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    formSubmit(): void {
        this.signUpForm.submitted = true;
        console.log(this.signUpForm.formGroup.valid);
        if (this.signUpForm.formGroup.valid) {
            this.signUpForm.submitting = true;
            let newUser: any = this.signUpForm.formGroup.getRawValue();
            let newUserFormData: FormData =
                this.buildUserStoreFormData(newUser);
            this._publicService.storeUser(newUserFormData).subscribe({
                next: (res: any) =>
                    this._router.navigateByUrl('/confirmation-required'),
                error: (error) => console.log(error),
            });
        }
    }
    signUp(): void {
        /*// Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            // Marcar todos los campos como tocados para mostrar errores
            Object.keys(this.signUpForm.controls).forEach((key) => {
                const control = this.signUpForm.get(key);
                control.markAsTouched();
            });
            return;
        }

        // Disable the form
        this.signUpForm.disable();
        this.isLoading = true;

        // Hide the alert
        this.showAlert = false;*/
        // Sign up
        /*this._authService.signUp(this.signUpForm.value).subscribe(
            (response) => {
                // Navigate to the confirmation required page
                this._router.navigateByUrl('/confirmation-required');
            },
            (response) => {
                // Re-enable the form
                this.signUpForm.enable();
                this.isLoading = false;

                // Reset the form
                this.signUpNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message:
                        'Ha ocurrido un error, por favor intente nuevamente.',
                };

                // Show the alert
                this.showAlert = true;
            }
        );*/
    }
}
