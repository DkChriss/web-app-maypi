import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MissingStore } from 'app/modules/dashboard/models/missing';
import { PublicService } from '../services/public.service';

@Component({
    selector: 'app-report',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatIconModule],
    templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {
    reportForm!: FormGroup;
    currentYear: number = new Date().getFullYear();
    profileImageName: string = '';
    eventImageName: string = '';

    @ViewChild('photo') photo!: ElementRef;
    @ViewChild('event_photo') event_photo!: ElementRef;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _publicService: PublicService
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.reportForm = this.fb.group({
            name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            age: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            description: ['', [Validators.required]],
            birthdate: ['', [Validators.required]],
            disappearance_date: ['', [Validators.required]],
            place_of_disappearance: ['', [Validators.required]],
            // email: ['', [Validators.required], [Validators.email]],
            // consent: [false],
            // date: ['', [Validators.required]],
            // location: ['', [Validators.required]],
            characteristics: ['', [Validators.required]],
            reporter_name: ['', [Validators.required]],
            reporter_phone: ['', [Validators.required]],
            photo: [null, [Validators.required]],
            event_photo: [null, [Validators.required]],
            // profileImage: ['', [Validators.required]],
            // eventImage: [''],
        });
    }

    triggerFileInput(inputType: 'photo' | 'event_photo'): void {
        if (inputType === 'photo') {
            this.photo.nativeElement.click();
        } else {
            this.event_photo.nativeElement.click();
        }
    }

    onFileSelected(event: Event, inputType: 'photo' | 'event_photo'): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            // Actualizar el nombre del archivo para mostrar en la UI
            if (inputType === 'photo') {
                this.profileImageName = file.name;
                this.reportForm.patchValue({ photo: file });
            } else {
                this.eventImageName = file.name;
                this.reportForm.patchValue({ event_photo: file });
            }
        }
    }

    resetForm(): void {
        this.reportForm.reset();
        this.profileImageName = '';
        this.eventImageName = '';
        // Reiniciar los valores por defecto
        this.reportForm.patchValue({
            consent: false,
        });
    }

    onSubmit(): void {
        if (this.reportForm.valid) {
            let missingForm = this.reportForm.getRawValue();
            let missingFormData: FormData =
                this.buildMissingStoreFormData(missingForm);
            this._publicService.saveMissing(missingFormData).subscribe({
                next: (resp: any) => {
                    console.log(resp);
                    this.goBack();
                },
                error: (error) => {
                    console.log(error);
                },
            });
        } else {
            // Marcar todos los campos como tocados para mostrar los errores
            Object.keys(this.reportForm.controls).forEach((key) => {
                const control = this.reportForm.get(key);
                control?.markAsTouched();
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/']); // Navegar a la ruta raíz (landing page)
    }

    buildMissingStoreFormData(data: MissingStore): FormData {
        const formData = new FormData();

        formData.append(
            'birthdate',
            new Date(data.birthdate).toISOString().split('T')[0]
        );
        formData.append(
            'disappearance_date',
            new Date(data.disappearance_date).toISOString().split('T')[0]
        );
        formData.append('user_id', null);
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
}
