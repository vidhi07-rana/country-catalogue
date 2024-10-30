import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

interface CountryDetail {
  name: { official: string };
  subregion: string;
  area: number;
  population: number;
  currencies: { [key: string]: { name: string } };
  maps: { googleMaps: string };
  timezones: string[];
  region: string;
}

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule], 
})
export class CountryDetailComponent implements OnInit {
  countryDetail!: CountryDetail;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const countryName = this.route.snapshot.paramMap.get('name');
    if (countryName) {
      this.fetchCountryDetail(countryName).subscribe((data) => {
        this.countryDetail = data[0];
      });
    }
  }

  fetchCountryDetail(name: string): Observable<CountryDetail[]> {
    return this.http.get<CountryDetail[]>(`https://restcountries.com/v3.1/name/${name}`);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
  currencyNames(): string[] {
    return Object.values(this.countryDetail.currencies).map((currency) => currency.name);
  }
}
