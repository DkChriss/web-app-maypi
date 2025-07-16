import { CommonModule, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';
import { FaqCategory } from 'app/modules/admin/apps/help-center/help-center.type';
import { PublicService } from 'app/modules/landing/home/services/public.service';
import {
    BehaviorSubject,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    Subject,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';

@Component({
    selector: 'help-center-faqs',
    templateUrl: './faqs.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NgFor,
        MatExpansionModule,
        CommonModule,
    ],
})
export class HelpCenterFaqsComponent implements OnInit, OnDestroy {
    faqCategories: FaqCategory[];
    private _unsubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _helpCenterService: HelpCenterService,
        private _publicService: PublicService
    ) {}
    //GETTING Faqs
    categoryFaqsTable = {
        reload: new BehaviorSubject<void>(null),
    };

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    totalItems = 0;

    categoryFaqsList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.categoryFaqsTable.reload,
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() =>
            this._publicService
                .listCategoryFaqs(this.pageNumber$.value, this.pageSize$.value)
                .pipe(
                    tap((res: any) => {
                        this.totalItems = res.total;
                    })
                )
        )
    );

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the FAQs
        this._helpCenterService.faqs$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((faqCategories) => {
                this.faqCategories = faqCategories;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
