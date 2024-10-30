import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, finalize, tap } from 'rxjs/operators';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Country {
  name: { common: string };
  capital?: string[];
  region?: string;
  languages?: { [key: string]: string };
  flags: { png: string };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, JsonPipe, RouterLink, HttpClientModule],
})
export class HomeComponent implements OnInit {
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  searchTerm$ = new Subject<string>();
  isSearching = false;  // Flag for searching state

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.searchTerm$
      .pipe(
        debounceTime(300),               // Wait for 300ms pause in typing
        distinctUntilChanged(),           // Avoid duplicate searches for the same term
        tap(() => (this.isSearching = true)),  // Set loading state
        switchMap((term) => this.searchCountries(term)),
        finalize(() => (this.isSearching = false)) // Reset loading state
      )
      .subscribe((results) => {
        this.filteredCountries = results;
      });
  }

  // Fetch all countries on demand (for fallback or cache)
  fetchCountries(): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/all');
  }

  // Search countries dynamically based on user input
  searchCountries(term: string): Observable<Country[]> {
    const trimmedTerm = term.trim().toLowerCase();

    if (!trimmedTerm) {
      return new Observable((observer) => {
        observer.next([]); // Empty results if no input
        observer.complete();
      });
    }

    return this.http.get<Country[]>(`https://restcountries.com/v3.1/name/${trimmedTerm}`);
  }

  // Trigger search term on input change
  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.searchTerm$.next(searchTerm); // Emit search term
  }
}
