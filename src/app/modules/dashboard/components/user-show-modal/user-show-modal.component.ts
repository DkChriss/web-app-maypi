import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { User } from '../../models/user';

@Component({
    selector: 'app-user-show-modal',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        FuseCardComponent,
        NgIf,
    ],
    templateUrl: './user-show-modal.component.html',
    styleUrl: './user-show-modal.component.scss',
})
export class UserShowModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<UserShowModalComponent>
    ) {}
}
