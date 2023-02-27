import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '@lib/types';
import { getSearchParam } from '@lib/utils';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { Character } from './character.model';
import { CharactersService } from './characters.service';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css'],
})
export class CharactersComponent implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly formBuilder = inject(FormBuilder);
  private readonly charactersService = inject(CharactersService);

  private readonly defaultPage = this.getCurrentPage();
  private readonly defaultName = this.getCurrentName();

  form = this.formBuilder.group({
    name: [this.defaultName],
  });

  characters$ = this.fetchCharacters(this.defaultPage, this.defaultName);

  currentPage = this.getCurrentPage();

  ngAfterViewInit(): void {
    this.form
      .get('name')
      ?.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((name) => {
        this.characters$ = this.fetchCharacters(
          this.getCurrentPage(),
          name || ''
        );

        if (name) {
          this.location.replaceState('/characters', `page=1&name=${name}`);
        } else {
          this.location.replaceState('/characters', `page=1`);
        }
      });
  }

  fetchCharacters(
    page: number,
    name?: string
  ): Observable<ApiResponse<Character[]>> {
    return this.charactersService.getCharacters(page, name);
  }

  onPaginationChange(value: string | number) {
    const page =
      typeof value === 'string'
        ? getSearchParam({ url: value, param: 'page' })
        : value;
    if (page) {
      this.currentPage = +page;

      const currentName = this.getCurrentName();

      this.characters$ = this.fetchCharacters(+page, currentName);

      this.location.replaceState(
        '/characters',
        `page=${page}${currentName && '&name=' + currentName}`
      );
    }
  }

  getPaginationRange(totalPages: number): number[] {
    const visiblePages = 10; // Number of pages visible in the pagination bar
    const halfVisiblePages = Math.floor(visiblePages / 2); // Number of pages visible before and after the current page

    let startPage = this.currentPage - halfVisiblePages;
    let endPage = this.currentPage + halfVisiblePages;

    if (startPage < 1) {
      startPage = 1;
      endPage = visiblePages;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - visiblePages + 1;
      if (startPage < 1) {
        startPage = 1;
      }
    }

    return Array(endPage - startPage + 1)
      .fill(0)
      .map((_, i) => startPage + i);
  }

  private getCurrentPage(): number {
    const page = this.route.snapshot.queryParamMap.get('page');

    return (page && +page) || 1;
  }

  private getCurrentName(): string {
    const name =
      this.form?.value?.name || this.route.snapshot.queryParamMap.get('name');

    return name || '';
  }
}
