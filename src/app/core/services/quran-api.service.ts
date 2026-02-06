import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import {
    Surah,
    SurahDetail,
    ApiResponse
} from '../models/quran.model';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QuranApiService {
    private readonly API_BASE = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Get all surahs
     */
    getSurahs(): Observable<Surah[]> {
        return this.http.get<ApiResponse<Surah[]>>(`${this.API_BASE}/surat`)
            .pipe(
                map(response => response.data),
                catchError(error => {
                    console.error('Error fetching surahs:', error);
                    return of([]);
                })
            );
    }

    /**
     * Get surah detail by number
     */
    getSurah(number: number): Observable<SurahDetail | null> {
        return this.http.get<ApiResponse<SurahDetail>>(`${this.API_BASE}/surat/${number}`)
            .pipe(
                map(response => response.data),
                catchError(error => {
                    console.error(`Error fetching surah ${number}:`, error);
                    return of(null);
                })
            );
    }
}
