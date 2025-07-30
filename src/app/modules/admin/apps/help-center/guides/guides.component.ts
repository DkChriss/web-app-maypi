import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';
import { GuideCategory } from 'app/modules/admin/apps/help-center/help-center.type';
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
    selector: 'help-center-guides',
    templateUrl: './guides.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NgFor,
        NgIf,
        CommonModule,
    ],
})
export class HelpCenterGuidesComponent implements OnInit, OnDestroy {
    guideCategories: GuideCategory[];
    private _unsubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _helpCenterService: HelpCenterService,
        private _publicService: PublicService
    ) {}

    //GETTING GUIDES
    categoryGuideTable = {
        reload: new BehaviorSubject<void>(null),
    };

    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    totalItems = 0;

    categoryGuidesList$ = combineLatest([
        this.pageSize$,
        this.pageNumber$,
        this.categoryGuideTable.reload,
    ]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() =>
            this._publicService
                .listCategoryGuides(
                    this.pageNumber$.value,
                    this.pageSize$.value
                )
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
        // Get the Guide categories
        this._helpCenterService.guides$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((guideCategories) => {
                this.guideCategories = guideCategories;
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
