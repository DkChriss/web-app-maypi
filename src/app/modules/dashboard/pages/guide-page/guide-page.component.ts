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
import { GuideService } from '../../services/guide.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Guide, GuideStore, GuideUpdate } from '../../models/guide';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'app-guide-page',
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
    templateUrl: './guide-page.component.html',
    styleUrl: './guide-page.component.scss'
})
export class GuidePageComponent implements OnInit, OnDestroy {
    @ViewChild('select_1', { static: false }) select_1: MatSelect;

    configForm: UntypedFormGroup;
    current_user: any = JSON.parse(localStorage.getItem('user') || '{}');
    isLoading = false;
    isEditMode = false;
    selectedGuide: Guide | null = null
    method = 'store'
    guideForm = {
        submitted: false,
        submitting: false,
        formGroup: new FormGroup({
            user_id: new FormControl<number>(this.current_user.id),
            category_id: new FormControl<number>(null, Validators.required),
            slug: new FormControl<string>('', Validators.required),
            title: new FormControl<string>('', Validators.required),
            subtitle: new FormControl<string>('', Validators.required),
            content: new FormControl<string>('', Validators.required)
        })
    }

    guideTable = {
        reload: new BehaviorSubject<void>(null)
    }

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    totalItems = 0
    guides: any

    //CATEGORIES
    pageSizeCategorySelect$ = new BehaviorSubject<number>(10)
    pageNumberCategorySelect$ = new BehaviorSubject<number>(1)

    guideList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.guideTable.reload
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this._guideService.list(
            parseInt(this.pageNumber$.value.toString()),
            parseInt(this.pageSize$.value.toString())
        ).pipe(
            tap((res: any) => {
                this.totalItems = res.total
                this.guides = res.data
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
        private _guideService: GuideService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder
    ) { }


    ngOnInit(): void {
        this.isLoading = false
        this.configForm = this._formBuilder.group({
            title: 'Eliminar la guia',
            message: 'Esta seguro de eliminar la guia? <span class="font-medium">Esta accion no puede ser reversible!</span>',
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
        this.guideForm.formGroup.reset()
        this.closeDetails()
        this.isEditMode = true;
        let newGuide: Guide = {
            id: this.guides[0]["id"],
            user_id: 1,
            category_id: 1,
            slug: 'slug',
            title: 'title',
            subtitle: 'subtitle',
            content: 'content'
        }
        this.method = 'store'
        this.selectedGuide = newGuide
    }

    store(): void {
        this.guideForm.submitted = true
        if (this.guideForm.formGroup.valid) {
            this.guideForm.submitting = true
            const newGuide: GuideStore = this.guideForm.formGroup.getRawValue()
            newGuide.user_id = this.current_user.id
            this._guideService.store(newGuide).subscribe({
                next: (resp: any) => {
                    this.guideTable.reload.next();
                    this.closeDetails()
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    toggleDetails(guide: Guide): void {
        this.isEditMode = !this.isEditMode
        if (this.selectedGuide?.id == guide.id) {
            this.selectedGuide = null
        } else {
            this.selectedGuide = guide
            this._guideService.show(guide.id).subscribe({
                next: (resp: any) => {
                    this.method = 'update'
                    this.isEditMode = true;
                    this.guideForm.formGroup.patchValue({
                        user_id: resp.data.user_id,
                        category_id: resp.data.category.id,
                        slug: resp.data.slug,
                        title: resp.data.title,
                        subtitle: resp.data.subtitle,
                        content: resp.data.content

                    }, { emitEvent: false })
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    closeDetails(): void {
        this.selectedGuide = null
        this.isEditMode = false
    }

    update(id: number): void {
        this.guideForm.submitted = true
        if (this.guideForm.formGroup.valid) {
            this.guideForm.submitting = true;
            const guideUpdate: GuideUpdate = this.guideForm.formGroup.getRawValue()
            guideUpdate.user_id = this.current_user.id
            this._guideService.update(id, guideUpdate).subscribe({
                next: (resp: any) => {
                    this.guideTable.reload.next();
                    this.closeDetails();
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    cancelEdit() {
        if (this.selectedGuide) {
            this.guideForm.formGroup.patchValue({
                user_id: this.selectedGuide.user_id,
                category_id: this.selectedGuide.category_id,
                slug: this.selectedGuide.slug,
                title: this.selectedGuide.title,
                subtitle: this.selectedGuide.subtitle,
                content: this.selectedGuide.content

            }, { emitEvent: false })
        }
        this.isEditMode = false;
    }

    delete(id: number) {
        if (id) {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == 'confirmed') {
                    this._guideService.delete(id).subscribe({
                        next: (resp) => {
                            this.guideTable.reload.next()
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
