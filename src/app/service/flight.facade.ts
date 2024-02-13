import {Injectable} from "@angular/core";
import {StoreService} from "./store.service";
import {FlightHttpService} from "./flight-http.service";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {Flight} from "../model/flight";

@Injectable({
    providedIn: 'root'
})

export class FlightFacadeService {

    constructor(private storeService: StoreService,
                private flightHttpService: FlightHttpService) {}

    getFlightList(): BehaviorSubject<Flight[]> {
        return this.storeService.getFlightList();
    }

    setSelectedFlight(flight: Flight): void {
        this.storeService.setSelectedFlight(flight);
    }

    getSelectedFlight(): BehaviorSubject<Flight> {
        return this.storeService.getSelectedFlight();
    }

    createFlight(flight: Flight): Observable<Flight> {
        return this.flightHttpService.createFlight(flight)
            .pipe(
                tap(result => {
                    // make a copy of the array and add the new flight to it
                    this.storeService.setFlightList([...this.storeService.getFlightList().value, result]);
                    this.storeService.setSelectedFlight({} as Flight);
                })
            );
    }

    getFlights(): Observable<Flight[]> {
        return this.flightHttpService.getFlights()
            .pipe(
                tap(result => this.storeService.setFlightList(result))
            );
    }

    getFlight(id: string): Observable<Flight> {
        return this.flightHttpService.getFlight(id)
            .pipe(
                tap(flight => this.storeService.setSelectedFlight(flight))
            );
    }

    updateFlight(flight: Flight): Observable<Flight> {
        return this.flightHttpService.updateFlight(flight)
            .pipe(
                tap(updated => {
                    this.storeService.getFlightList().next(
                        this.storeService.getFlightList().value.map(flight => {
                            // if the ids match, we want to replace the item with the updated one
                            return flight.id === updated.id ? updated : flight;
                        })
                    )
                })
            );
    }

    deleteFlight(id: string): Observable<Flight> {
        return this.flightHttpService.deleteFlight(id)
            .pipe(
                tap(result => {
                    this.storeService.getFlightList().next(
                        // remove the deleted one from the list and update the store
                        this.storeService.getFlightList().value.filter(fl => fl.id !== result.id)
                    )
                })
            );
    }
}