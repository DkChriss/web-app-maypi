import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { QuillModule } from 'ngx-quill';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { FaqService } from '../../services/faq.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CategoryService } from '../../services/category.service';
import { Faq, FaqStore, FaqUpdate } from '../../models/faq';

@Component({
    selector: 'app-faqs-page',
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
    templateUrl: './faqs-page.component.html',
    styleUrl: './faqs-page.component.scss'
})
export class FaqsPageComponent implements OnInit, OnDestroy {
    @ViewChild('select_1', { static: false }) select_1: MatSelect;

    configForm: UntypedFormGroup;
    current_user: any = JSON.parse(localStorage.getItem('user') || '{}');
    isLoading = false;
    isEditMode = false;
    selectFaq: Faq | null = null
    method = 'store'
    faqForm = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(this.current_user.id),
            category_id: new FormControl<number>(null, Validators.required),
            question: new FormControl<string>('', Validators.required),
            answer: new FormControl<string>('', Validators.required),
        })
    }

    faqTable = {
        reload: new BehaviorSubject<void>(null)
    }

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    totalItems = 0
    faqs: any

    //CATEGORIES
    pageSizeCategorySelect$ = new BehaviorSubject<number>(10)
    pageNumberCategorySelect$ = new BehaviorSubject<number>(1)

    faqList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.faqTable.reload
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this._faqService.list(
            parseInt(this.pageNumber$.value.toString()),
            parseInt(this.pageSize$.value.toString())
        ).pipe(
            tap((res: any) => {
                this.totalItems = res.total
                this.faqs = res.data
                this.isLoading = false
            })
        ))
    )

    categories: any = []
    canLoadMore: boolean = false

    categorySelect = {
        reload: new BehaviorSubject<void>(null)
    }

    categorySelectList$ = combineLatest([
        this.pageSizeCategorySelect$,
        this.pageNumberCategorySelect$,
        this.categorySelect.reload
    ]).pipe(
        distinctUntilChanged(),
        switchMap(() => this._categoryService.list(
            parseInt(this.pageNumberCategorySelect$.value.toString()),
            parseInt(this.pageSizeCategorySelect$.value.toString())
        ).pipe(
            tap((res: any) => {
                this.canLoadMore = res.links.next !== null
                if (this.categories.length === 0) {
                    this.categories = res.data
                } else {
                    res.data.forEach(element => {
                        if (!this.categories.some(user => user.id === element.id)) {
                            this.categories.push(element)
                        }
                    });
                }
            })
        ))
    )

    constructor(
        private _categoryService: CategoryService,
        private _faqService: FaqService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder
    ) { }


    ngOnInit(): void {
        this.isLoading = false
        this.configForm = this._formBuilder.group({
            title: 'Eliminar la pregunta frecuente',
            message: 'Esta seguro de eliminar la pregunta frecuente? <span class="font-medium">Esta accion no puede ser reversible!</span>',
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
        this.faqForm.formGroup.reset()
        this.closeDetails()
        this.isEditMode = true;
        let newFaq: Faq = {
            id: this.faqs[0]["id"],
            user_id: 1,
            category_id: 1,
            question: 'slug',
            answer: 'title'
        }
        this.method = 'store'
        this.selectFaq = newFaq
    }

    store(): void {
        this.faqForm.submitted = true
        if (this.faqForm.formGroup.valid) {
            this.faqForm.submitting = true
            const newFaq: FaqStore = this.faqForm.formGroup.getRawValue()
            newFaq.user_id = this.current_user.id
            this._faqService.store(newFaq).subscribe({
                next: (resp: any) => {
                    this.faqTable.reload.next();
                    this.closeDetails()
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    toggleDetails(faq: Faq): void {
        this.isEditMode = !this.isEditMode
        if (this.selectFaq?.id == faq.id) {
            this.selectFaq = null
        } else {
            this.selectFaq = faq
            this._faqService.show(faq.id).subscribe({
                next: (resp: any) => {
                    this.method = 'update'
                    this.isEditMode = true;
                    this.faqForm.formGroup.patchValue({
                        user_id: resp.data.user_id,
                        category_id: resp.data.category.id,
                        question: resp.data.question,
                        answer: resp.data.answer

                    }, { emitEvent: false })
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    closeDetails(): void {
        this.selectFaq = null
        this.isEditMode = false
    }

    update(id: number): void {
        this.faqForm.submitted = true
        if (this.faqForm.formGroup.valid) {
            this.faqForm.submitting = true;
            const faqUpdate: FaqUpdate = this.faqForm.formGroup.getRawValue()
            faqUpdate.user_id = this.current_user.id
            this._faqService.update(id, faqUpdate).subscribe({
                next: (resp: any) => {
                    this.faqTable.reload.next();
                    this.closeDetails();
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    cancelEdit() {
        if (this.selectFaq) {
            this.faqForm.formGroup.patchValue({
                user_id: this.selectFaq.user_id,
                category_id: this.selectFaq.category_id,
                question: this.selectFaq.question,
                answer: this.selectFaq.answer,

            }, { emitEvent: false })
        }
        this.isEditMode = false;
    }

    delete(id: number) {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._faqService.delete(id).subscribe({
                        next: (resp) => {
                            this.faqTable.reload.next()
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
                        const nextPage: number = this.pageNumberCategorySelect$.value + 1;
                        this.pageNumberCategorySelect$.next(nextPage);
                    }
                }
            );
        }
    }
}
