import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {Flight} from "../model/flight";

@Injectable({
  providedIn: 'root'
})
export class FlightHttpService {
  private url = 'https://mock-json-server-five.vercel.app/flights';
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {}

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.url)
        .pipe(
            catchError(this.handleError<Flight[]>([]))
        );
  }

  getFlight(id: string): Observable<any> {
    const url = `${this.url}/${id}`;

    return this.http.get<Flight>(url)
        .pipe(
            catchError(this.handleError<any>("Get Failed"))
        );
  }

  deleteFlight(id: string): Observable<any> {
    const url = `${this.url}/${id}`;

    return this.http.delete<Flight>(url, this.httpOptions)
        .pipe(
            catchError(this.handleError<any>('Delete failed'))
        );
  }

  updateFlight(flight: Flight): Observable<any> {
    const url = `${this.url}/${flight.id}`;

    return this.http.put<Flight>(url, flight, this.httpOptions)
        .pipe(
            catchError(this.handleError<any>('Update failed'))
        );
  }

  createFlight(flight: Flight): Observable<any> {
    return this.http.post<Flight>(this.url, flight, this.httpOptions)
        .pipe(
            catchError(this.handleError<any>('Add failed'))
        );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
