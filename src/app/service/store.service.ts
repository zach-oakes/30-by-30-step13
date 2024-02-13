import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Flight} from "../model/flight";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private flightList$: BehaviorSubject<Flight[]> = new BehaviorSubject<Flight[]>([]);
  private selectedFlight$: BehaviorSubject<Flight> = new BehaviorSubject<Flight>({} as Flight);

  getFlightList(): BehaviorSubject<Flight[]> {
    return this.flightList$;
  }

  setFlightList(flightList: Flight[]): void {
    this.flightList$.next(flightList);
  }

  getSelectedFlight(): BehaviorSubject<Flight> {
    return this.selectedFlight$;
  }

  setSelectedFlight(flight: Flight): void {
    this.selectedFlight$.next(flight);
  }
}
