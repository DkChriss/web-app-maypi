import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Category, CategoryUpdate } from '../../models/category';
import { FuseConfirmationService } from '@fuse/services/confirmation';

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
        MatCardModule

    ],
    templateUrl: './category-page.component.html',
    styleUrl: './category-page.component.scss'
})
export class CategoryPageComponent implements OnInit, OnDestroy {

    isLoading = false;
    isEditMode = false;
    selectedCategory: Category | null = null

    categoryForm = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            id: new FormControl<number>(null),
            title: new FormControl('', Validators.required),
            slug: new FormControl('', Validators.required)
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
                this.isLoading = false
            })
        ))
    )

    constructor(
        private _categoryService: CategoryService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) { }

    ngOnInit(): void {
        this.isLoading = false
    }

    ngOnDestroy(): void {

    }

    toggleDetails(category: Category): void {
        if (this.selectedCategory?.id == category.id) {
            this.selectedCategory = null
        } else {
            this.selectedCategory = category
            this._categoryService.show(category.id).subscribe({
                next: (resp: any) => {
                    this.isEditMode = true;
                    this.categoryForm.formGroup.patchValue({
                        id: resp.data.id,
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
    }

    update(id: number): void {
        this.categoryForm.submitted = true
        if (this.categoryForm.formGroup.valid) {
            this.categoryForm.submitting = true;
            let categoryUpdate: CategoryUpdate = this.categoryForm.formGroup.value;
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
                id: this.selectedCategory.id,
                title: this.selectedCategory.title,
                slug: this.selectedCategory.slug
            }, { emitEvent: false })
        }
        this.isEditMode = false;
    }

    delete(id: number): void {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open({
                title: 'Eliminar elemento',
                message: '¿Estás segura de que deseas eliminar este elemento?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:trash',
                    color: 'warn',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'Sí, eliminar',
                        color: 'warn',
                    },
                    cancel: {
                        show: true,
                        label: 'Cancelar',
                    },
                },
                dismissible: false,
            });

        }
    }


}
