import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    BehaviorSubject,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap,
} from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { QuillModule } from 'ngx-quill';
import { UserRegisterFormComponent } from '../../components/user-register-form/user-register-form.component';
import { User } from '../../models/user';
import { UserEditFormComponent } from '../../components/user-edit-form/user-edit-form.component';
import { UserAssignRolesFormComponent } from '../../components/user-assign-roles-form/user-assign-roles-form.component';
import { UserAssignPermissionsFormComponent } from '../../components/user-assign-permissions-form/user-assign-permissions-form.component';
import { UserShowModalComponent } from '../../components/user-show-modal/user-show-modal.component';

@Component({
    selector: 'app-user-page',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        QuillModule,
        MatCardModule,
        MatDialogModule,
        MatSelectModule,
    ],
    templateUrl: './user-page.component.html',
    styleUrl: './user-page.component.scss',
})
export class UserPageComponent implements OnInit {
    displayedColumns: string[] = ['name', 'email', 'phone', 'code', 'actions'];
    configForm: UntypedFormGroup;
    isLoading: boolean = true;

    userTable = {
        reload: new BehaviorSubject<void>(null),
    };

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    searchBy$ = new BehaviorSubject<string>('');
    totalItems = 0;

    userList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.searchBy$,
        this.userTable.reload,
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() =>
            this._userService
                .list(
                    parseInt(this.pageNumber$.value.toString()),
                    parseInt(this.pageSize$.value.toString()),
                    this.searchBy$.value
                )
                .pipe(
                    tap((res: any) => {
                        this.totalItems = res.total;
                        this.isLoading = false;
                    }),
                    map((res: any) => res.data)
                )
        )
    );

    constructor(
        private dialog: MatDialog,
        private _userService: UserService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.isLoading = false;
        this.configForm = this._formBuilder.group({
            title: 'Eliminar usuario',
            message:
                'Esta seguro de eliminar el usuario? <span class="font-medium">Esta accion no puede ser reversible!</span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Eliminar',
                    color: 'warn',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancelar',
                }),
            }),
            dismissible: false,
        });
    }

    store(): void {
        const dialogRef = this.dialog.open(UserRegisterFormComponent, {
            width: '70%',
            height: 'auto',
            disableClose: false,
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.userTable.reload.next();
        });
    }

    update(user: User): void {
        const dialogRef = this.dialog.open(UserEditFormComponent, {
            width: '70%',
            height: 'auto',
            disableClose: false,
            data: {
                user: user,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.userTable.reload.next();
        });
    }

    delete(id: number) {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open(
                this.configForm.value
            );

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._userService.delete(id).subscribe({
                        next: (resp) => {
                            this.userTable.reload.next();
                        },
                        error: (error) => {
                            console.log(error);
                        },
                    });
                }
            });
        }
    }

    assignRoles(id: number) {
        const dialogRef = this.dialog.open(UserAssignRolesFormComponent, {
            width: '40%',
            height: 'auto',
            disableClose: false,
            data: {
                user: id,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.userTable.reload.next();
        });
    }

    assignPermissions(id: number) {
        const dialogRef = this.dialog.open(UserAssignPermissionsFormComponent, {
            width: '40%',
            height: 'auto',
            disableClose: false,
            data: {
                user: id,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.userTable.reload.next();
        });
    }

    showInfoUser(id: number) {
        let dialogRef;
        this._userService.show(id).subscribe({
            next: (resp: any) => {
                dialogRef = this.dialog.open(UserShowModalComponent, {
                    width: '40%',
                    height: 'auto',
                    disableClose: false,
                    data: {
                        user: resp.data,
                    },
                });
                dialogRef.afterClosed().subscribe((result) => {
                    this.userTable.reload.next();
                });
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    onPageChange(event) {
        this.pageNumber$.next(event.pageIndex + 1);
        this.pageSize$.next(event.pageSize);
    }
}
