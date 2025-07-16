import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionService } from '../../services/permission.service';
import { UserService } from '../../services/user.service';
import {
    FormGroup,
    FormControl,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import {
    BehaviorSubject,
    combineLatest,
    distinctUntilChanged,
    switchMap,
    tap,
} from 'rxjs';
import { UserPermission } from '../../models/user';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-user-assign-permissions-form',
    standalone: true,
    imports: [
        MatDialogModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        CommonModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatDatepickerModule,
    ],
    templateUrl: './user-assign-permissions-form.component.html',
    styleUrl: './user-assign-permissions-form.component.scss',
})
export class UserAssignPermissionsFormComponent {
    @ViewChild('select_1', { static: false }) select_1: MatSelect;

    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(1, Validators.required),
            permissions_ids: new FormControl<Array<number>>(
                null,
                Validators.required
            ),
        }),
    };
    //Permissions
    pageSizePermissionSelect$ = new BehaviorSubject<number>(10);
    pageNumberPermissionSelect$ = new BehaviorSubject<number>(1);

    permissions: any = [];
    canLoadMore: boolean = false;

    permissionSelect = {
        reload: new BehaviorSubject<void>(null),
    };

    permissionSelectList$ = combineLatest([
        this.pageSizePermissionSelect$,
        this.pageNumberPermissionSelect$,
        this.permissionSelect.reload,
    ]).pipe(
        distinctUntilChanged(),
        switchMap(() =>
            this._permissionService
                .list(
                    parseInt(this.pageNumberPermissionSelect$.value.toString()),
                    parseInt(this.pageSizePermissionSelect$.value.toString())
                )
                .pipe(
                    tap((res: any) => {
                        this.canLoadMore = res.links.next !== null;
                        if (this.permissions.length === 0) {
                            this.permissions = res.data;
                        } else {
                            res.data.forEach((element) => {
                                if (
                                    !this.permissions.some(
                                        (permission) =>
                                            permission.id === element.id
                                    )
                                ) {
                                    this.permissions.push(element);
                                }
                            });
                        }
                    })
                )
        )
    );
    constructor(
        public dialogRef: MatDialogRef<UserAssignPermissionsFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _userService: UserService,
        private _permissionService: PermissionService
    ) {}

    get Form() {
        return this.form.formGroup.controls;
    }

    ngOnInit(): void {}

    formSubmit(): void {
        this.form.submitted = true;
        if (this.form.formGroup.valid) {
            this.form.submitting = true;
            let newUserPermissions: UserPermission =
                this.form.formGroup.getRawValue();
            newUserPermissions.user_id = this.data.user;
            this._userService.assignPermissions(newUserPermissions).subscribe({
                next: (resp) => this.dialogRef.close(),
                error: (error) => console.log(error),
            });
        }
    }

    onOpenedChange(event: any, select: string) {
        if (event) {
            this[select].panel.nativeElement.addEventListener(
                'scroll',
                (event: any) => {
                    if (
                        this[select].panel.nativeElement.scrollTop ===
                        this[select].panel.nativeElement.scrollHeight -
                            this[select].panel.nativeElement.offsetHeight
                    ) {
                        const nextPage: number =
                            this.pageNumberPermissionSelect$.value + 1;
                        this.pageNumberPermissionSelect$.next(nextPage);
                    }
                }
            );
        }
    }
}
