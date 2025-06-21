import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogModule,
} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-missing-image-modal',
    standalone: true,
    imports: [MatDialogModule, CommonModule, MatButtonModule],
    templateUrl: './missing-image-modal.component.html',
    styleUrl: './missing-image-modal.component.scss',
})
export class MissingImageModalComponent implements OnInit {
    photo;
    event_photo;

    constructor(
        private dialogRef: MatDialogRef<MissingImageModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.photo = this.data.images.photo;
        this.event_photo = this.data.images.event_photo;
    }

    close() {
        this.dialogRef.close();
    }
}
