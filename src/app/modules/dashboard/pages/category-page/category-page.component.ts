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
    searchBy$ = new BehaviorSubject<string>("");
    totalItems = 0
    categories: any

    categoryList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.searchBy$,
        this.categoryTable.reload
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this._categoryService.list(
            this.pageNumber$.value,
            this.pageSize$.value,
            this.searchBy$.value
        ).pipe(
            tap((res: any) => {
                this.totalItems = res.total
                this.categories = res.data
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
        //CONFIRMATION DIALOG
        this.isLoading = false
        this.configForm = this._formBuilder.group({
            title: 'Eliminar la categoria',
            message: 'Esta seguro de eliminar la categoria? <span class="font-medium">Esta accion no puede ser reversible!</span>',
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

    ngOnDestroy(): void {

    }

    openStore(): void {
        this.categoryForm.formGroup.reset()
        this.closeDetails()
        this.isEditMode = true;
        let newCategory: Category = { id: this.categories[0]["id"], title: 'nombre', slug: 'slug' }
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
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._categoryService.delete(id).subscribe({
                        next: (resp) => {
                            this.categoryTable.reload.next()
                            this.method = this.totalItems === 0 ? "store" : "update"
                        }, error: (error) => {
                            console.log(error)
                        }
                    })
                }
            });
        }
    }

    onPageChange(event) {
        this.pageNumber$.next(event.pageIndex + 1)
        this.pageSize$.next(event.pageSize)
    }


}
