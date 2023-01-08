import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitiesApiService {
  private citiesApi = 'https://raw.githubusercontent.com/millbj92/US-Zip-Codes-JSON/master/USCities.json';

  constructor(private http: HttpClient) { }
  getCities(): Observable<any> {
    return this.http.get<any>(this.citiesApi);
  }
}
