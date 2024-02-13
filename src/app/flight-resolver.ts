import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Flight} from "./model/flight";
import {inject} from "@angular/core";
import {FlightFacadeService} from "./service/flight.facade";
import {Observable, of} from "rxjs";

export const FlightResolver: ResolveFn<Flight> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    flightFacadeService: FlightFacadeService = inject(FlightFacadeService)
): Observable<Flight> => {
    const id = route.paramMap.get('id')!;

    // id of 'new' means we are creating a new flight. No network call should be made.
    return id === 'new' ? of({} as Flight) : flightFacadeService.getFlight(id);
};
