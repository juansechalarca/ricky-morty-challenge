import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@lib/tokens';
import { ApiResponse } from '@lib/types';
import { catchError, Observable, throwError } from 'rxjs';
import { Character } from './character.model';

@Injectable({ providedIn: 'root' })
export class CharactersService {
  private readonly apiUrl = inject(API_URL);
  private readonly http = inject(HttpClient);

  /**
   * Obtiene todos los personajes de una página
   * @param page página actual
   * @param name nombre del personaje
   * @link https://rickandmortyapi.com/api/character
   * @returns lista de personajes
   */
  getCharacters(
    page: number,
    name?: string
  ): Observable<ApiResponse<Character[]>> {
    let params = new HttpParams().set('page', page);

    if (name) {
      params = params.set('name', name);
    }

    return this.http
      .get<ApiResponse<Character[]>>(`${this.apiUrl}/character`, {
        params,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);

          if (error.status === 404) {
            return throwError(() => null);
          }

          return throwError(() => error);
        })
      );
  }
}
