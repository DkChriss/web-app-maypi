import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogModule,
} from '@angular/material/dialog';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { UserRole } from '../../models/user';
import {
    BehaviorSubject,
    combineLatest,
    distinctUntilChanged,
    switchMap,
    tap,
} from 'rxjs';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseLoadingService } from '@fuse/services/loading';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-user-assign-roles-form',
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
    templateUrl: './user-assign-roles-form.component.html',
    styleUrl: './user-assign-roles-form.component.scss',
})
export class UserAssignRolesFormComponent implements OnInit {
    @ViewChild('select_1', { static: false }) select_1: MatSelect;

    form = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(1, Validators.required),
            roles_ids: new FormControl<Array<number>>(
                null,
                Validators.required
            ),
        }),
    };
    //ROLES
    pageSizeRoleSelect$ = new BehaviorSubject<number>(10);
    pageNumberRoleSelect$ = new BehaviorSubject<number>(1);

    roles: any = [];
    canLoadMore: boolean = false;

    roleSelect = {
        reload: new BehaviorSubject<void>(null),
    };

    roleSelectList$ = combineLatest([
        this.pageSizeRoleSelect$,
        this.pageNumberRoleSelect$,
        this.roleSelect.reload,
    ]).pipe(
        distinctUntilChanged(),
        switchMap(() =>
            this._roleService
                .list(
                    parseInt(this.pageNumberRoleSelect$.value.toString()),
                    parseInt(this.pageSizeRoleSelect$.value.toString())
                )
                .pipe(
                    tap((res: any) => {
                        this.canLoadMore = res.links.next !== null;
                        if (this.roles.length === 0) {
                            this.roles = res.data;
                        } else {
                            res.data.forEach((element) => {
                                if (
                                    !this.roles.some(
                                        (role) => role.id === element.id
                                    )
                                ) {
                                    this.roles.push(element);
                                }
                            });
                        }
                    })
                )
        )
    );
    constructor(
        public dialogRef: MatDialogRef<UserAssignRolesFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _userService: UserService,
        private _roleService: RoleService
    ) {}

    get Form() {
        return this.form.formGroup.controls;
    }

    ngOnInit(): void {}

    formSubmit(): void {
        this.form.submitted = true;
        if (this.form.formGroup.valid) {
            this.form.submitting = true;
            let newUserRoles: UserRole = this.form.formGroup.getRawValue();
            newUserRoles.user_id = this.data.user;
            this._userService.assignRoles(newUserRoles).subscribe({
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
                            this.pageNumberRoleSelect$.value + 1;
                        this.pageNumberRoleSelect$.next(nextPage);
                    }
                }
            );
        }
    }
}
