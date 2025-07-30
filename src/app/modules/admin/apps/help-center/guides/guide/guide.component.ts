import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';
import { GuideCategory } from 'app/modules/admin/apps/help-center/help-center.type';
import { GuideService } from 'app/modules/dashboard/services/guide.service';
import { PublicService } from 'app/modules/landing/home/services/public.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'help-center-guides-guide',
    templateUrl: './guide.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatIconModule, CommonModule],
})
export class HelpCenterGuidesGuideComponent implements OnInit, OnDestroy {
    guide: any;
    hasNextGuide: boolean = false;
    nextGuide: any;
    /**
     * Constructor
     */
    constructor(
        private _guideService: GuideService,
        private route: ActivatedRoute
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this._guideService.show(params.id).subscribe({
                next: (resp: any) => {
                    this.guide = resp.data;
                },
            });
            let nextId: number = Number.parseInt(params.id) + 1;
            this._guideService.show(nextId).subscribe({
                next: (resp: any) => {
                    this.hasNextGuide = resp && resp.data;
                    if (this.hasNextGuide) {
                        this.nextGuide = resp.data;
                    }
                },
                error: (err: any) => {
                    this.hasNextGuide = false;
                },
            });
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
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
}
