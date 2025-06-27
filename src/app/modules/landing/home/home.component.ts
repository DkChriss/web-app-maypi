import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PublicService } from './services/public.service';
import {
    BehaviorSubject,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    switchMap,
    tap,
} from 'rxjs';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatIconModule, CommonModule],
})
export class LandingHomeComponent implements OnInit {
    // Propiedad para controlar la visibilidad del menú móvil
    isMenuOpen: boolean = false;

    // Propiedad para mostrar el año actual en el footer
    currentYear: number = new Date().getFullYear();

    persons_list = [
        {
            name: 'Nataniel L. Heardy',
            age: 25,
            height: 1.8,
            weight: 80,
            hair: 'Liso',
            emergency_contact: '+591 12345678',
            last_location:
                'Calle 123 Nº 1 Provincia Buenos Aires de la ciudad de Cochabamba',
        },
        {
            name: 'Nataniel L. Heardy',
            age: 25,
            height: 1.8,
            weight: 80,
            hair: 'Liso',
            emergency_contact: '+591 12345678',
            last_location:
                'Calle 123 Nº 1 Provincia Buenos Aires de la ciudad de Cochabamba',
        },
        {
            name: 'Nataniel L. Heardy',
            age: 25,
            height: 1.8,
            weight: 80,
            hair: 'Liso',
            emergency_contact: '+591 12345678',
            last_location:
                'Calle 123 Nº 1 Provincia Buenos Aires de la ciudad de Cochabamba',
        },
        {
            name: 'Lucal Obregon',
            age: 25,
            height: 1.8,
            weight: 80,
            hair: 'Liso',
            emergency_contact: '+591 12345678',
            last_location:
                'Calle 123 Nº 1 Provincia Buenos Aires de la ciudad de Cochabamba',
        },
        {
            name: 'Nataniel L. Heardy',
            age: 25,
            height: 1.8,
            weight: 80,
            hair: 'Liso',
            emergency_contact: '+591 12345678',
            last_location:
                'Calle 123 Nº 1 Provincia Buenos Aires de la ciudad de Cochabamba',
        },
        {
            name: 'Nataniel L. Heardy',
            age: 25,
            height: 1.8,
            weight: 80,
            hair: 'Liso',
            emergency_contact: '+591 12345678',
            last_location:
                'Calle 123 Nº 1 Provincia Buenos Aires de la ciudad de Cochabamba',
        },
    ];

    currentBlock = 0;

    get paginatedList() {
        const start = this.currentBlock * 6;
        return this.persons_list.slice(start, start + 6);
    }

    nextBlock() {
        if ((this.currentBlock + 1) * 6 < this.persons_list.length) {
            this.currentBlock++;
        }
    }

    prevBlock() {
        if (this.currentBlock > 0) {
            this.currentBlock--;
        }
    }
    pageSize$ = new BehaviorSubject<number>(10);
    pageNumber$ = new BehaviorSubject<number>(1);
    missingList$ = combineLatest([this.pageSize$, this.pageNumber$]).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() =>
            this._publicService
                .listMissing(
                    parseInt(this.pageNumber$.value.toString()),
                    parseInt(this.pageSize$.value.toString())
                )
                .pipe(
                    tap((res: any) => {
                        console.log(res);
                    })
                )
        )
    );

    constructor(private _publicService: PublicService) {}

    ngOnInit(): void {}

    // Método para alternar la visibilidad del menú móvil
    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
