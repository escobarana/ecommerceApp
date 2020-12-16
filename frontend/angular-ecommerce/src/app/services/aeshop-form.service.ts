import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { Province } from '../common/province';

@Injectable({
  providedIn: 'root'
})
export class AEshopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private pronvincesUrl = 'http://localhost:8080/api/provinces';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getProvinces(theCountryCode:string): Observable<Province[]>{

    // search url
    const searchProvincesUrl = `${this.pronvincesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseProvinces>(searchProvincesUrl).pipe(
      map(response => response._embedded.provinces)
    );

  }

  getCreditCardMonths(startMonth: number): Observable<number[]>{

    let data: number[] = [];

    // build an array for 'Month' dropdown list
    // - start at current month and loop until

    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data); // the 'of' operator from rxjs, will wrap an object as an Observable
  }

  getCreditCardYears(): Observable<number[]>{

    let data: number[] = [];

    // build an array for 'Year' drop down list
    // - start at current year and loop for the next 10 years

    const startYear: number = new Date().getFullYear();
    const endYear:number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }

}

// Unwrap the JSON from Spring Data REST _embedded entry
interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}
interface GetResponseProvinces {
  _embedded: {
    provinces: Province[];
  }
}
