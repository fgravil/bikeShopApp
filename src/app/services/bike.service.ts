import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bike } from '../models/bike';
import { Lookup } from '../models/lookup';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  private bikeApiUrl: string;

  constructor(private http: HttpClient) {
    this.bikeApiUrl = `${environment.bikeApi}/bike`;
   }

  getManufacturers() {
    return this.http.get<Lookup[]>(`${environment.bikeApi}/lookup/manufacturers`);
  }

  getBikes() {
    return this.http.get<Bike[]>(this.bikeApiUrl);
  }

  addBike(bike: Bike) {
    return this.http.post<Bike>(this.bikeApiUrl, bike);
  }

  editBike(bikeId: string, bike: Bike) {
    return this.http.put<Bike>(`${this.bikeApiUrl}/${bikeId}`, bike);
  }

  deleteBike(bikeId: string) {
    return this.http.delete(`${this.bikeApiUrl}/${bikeId}`);
  }
}
