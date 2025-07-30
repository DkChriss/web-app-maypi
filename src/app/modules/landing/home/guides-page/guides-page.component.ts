import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicService } from '../services/public.service';

@Component({
    selector: 'app-guides-page',
    standalone: true,
    imports: [
        MatButtonModule,
        RouterLink,
        MatIconModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './guides-page.component.html',
    styleUrl: './guides-page.component.scss',
})
export class GuidesPageComponent implements OnInit {
    isMenuOpen: boolean = false;
    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }

    guide: any;
    hasNextGuide: boolean = false;
    nextGuide: any;

    constructor(
        private _publicService: PublicService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this._publicService.showGuide(params.id).subscribe({
                next: (resp: any) => {
                    this.guide = resp.data;
                },
            });
            let nextId: number = Number.parseInt(params.id) + 1;
            this._publicService.showGuide(nextId).subscribe({
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
}
