import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { QuillModule } from 'ngx-quill';
import { CategoryService } from '../../services/category.service';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { Category, CategoryStore, CategoryUpdate } from '../../models/category';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-category-page',
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
    ],
    templateUrl: './category-page.component.html',
    styleUrl: './category-page.component.scss'
})
export class CategoryPageComponent implements OnInit, OnDestroy {
    configForm: UntypedFormGroup;

    isLoading = false;
    isEditMode = false;
    selectedCategory: Category | null = null
    method = 'store'
    categoryForm = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            title: new FormControl<string>('', Validators.required),
            slug: new FormControl<string>('', Validators.required)
        })
    }

    categoryTable = {
        reload: new BehaviorSubject<void>(null)
    }

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    totalItems = 0

    categoryList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.categoryTable.reload
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this._categoryService.list(
            parseInt(this.pageNumber$.value.toString()),
            parseInt(this.pageSize$.value.toString())
        ).pipe(
            tap((res: any) => {
                this.totalItems = res.total

                this.isLoading = false
            })
        ))
    )

    constructor(
        private _categoryService: CategoryService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
    ) { }

    ngOnInit(): void {
        this.isLoading = false
        this.configForm = this._formBuilder.group({
            title: 'Remove contact',
            message: 'Are you sure you want to remove this contact permanently? <span class="font-medium">This action cannot be undone!</span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Remove',
                    color: 'warn',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel',
                }),
            }),
            dismissible: false,
        });
    }

    ngOnDestroy(): void {

    }

    openStore(): void {
        this.categoryForm.formGroup.reset()
        this.closeDetails()
        this.isEditMode = true;
        let newCategory: Category = { id: 1, title: 'nombre', slug: 'slug' }
        this.method = 'store'
        this.selectedCategory = newCategory
    }

    store(): void {
        this.categoryForm.submitted = true
        if (this.categoryForm.formGroup.valid) {
            this.categoryForm.submitting = true
            const newCategory: CategoryStore = this.categoryForm.formGroup.getRawValue()
            this._categoryService.store(newCategory).subscribe({
                next: (resp: any) => {
                    this.categoryTable.reload.next();
                    this.closeDetails();
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    toggleDetails(category: Category): void {
        this.isEditMode = !this.isEditMode
        if (this.selectedCategory?.id == category.id) {
            this.selectedCategory = null
        } else {
            this.selectedCategory = category
            this._categoryService.show(category.id).subscribe({
                next: (resp: any) => {
                    this.method = 'update'
                    this.isEditMode = true;
                    this.categoryForm.formGroup.patchValue({
                        title: resp.data.title,
                        slug: resp.data.slug
                    }, { emitEvent: false })
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    closeDetails(): void {
        this.selectedCategory = null
        this.isEditMode = false
    }

    update(id: number): void {
        this.categoryForm.submitted = true
        if (this.categoryForm.formGroup.valid) {
            this.categoryForm.submitting = true;
            let categoryUpdate: CategoryUpdate = this.categoryForm.formGroup.getRawValue();
            this._categoryService.update(id, categoryUpdate).subscribe({
                next: (resp: any) => {
                    this.categoryTable.reload.next()
                    this.closeDetails()
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    cancelEdit() {
        if (this.selectedCategory) {
            this.categoryForm.formGroup.patchValue({
                title: this.selectedCategory.title,
                slug: this.selectedCategory.slug
            }, { emitEvent: false })
        }
        this.isEditMode = false;
    }

    delete(id: number): void {
        if (id) {
            // Open the dialog and save the reference of it
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            // Subscribe to afterClosed from the dialog reference
            dialogRef.afterClosed().subscribe((result) => {
                console.log(result);
            });
        }
    }


}
