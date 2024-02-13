import {Component,OnInit} from '@angular/core';
import {Flight} from "../model/flight";
import {DatePipe} from "@angular/common";
import {provideNativeDateAdapter} from "@angular/material/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FlightClass} from "../model/flight-class";
import { v4 } from 'uuid';
import {BehaviorSubject} from "rxjs";
import {FlightFacadeService} from "../service/flight.facade";

@Component({
  selector: 'app-flight-detail-view',
  templateUrl: './flight-detail-view.component.html',
  styleUrl: './flight-detail-view.component.css',
  providers: [provideNativeDateAdapter(), DatePipe]
})
export class FlightDetailViewComponent implements OnInit {
  isLoading = true;
  selectedFlight$: BehaviorSubject<Flight>;
  flight: Flight = {} as Flight;
  invalidArrival = false;
  invalidDeparture = false;
  flightId = '';
  flightClasses: string[] = Object.values(FlightClass);

  constructor(private datePipe: DatePipe,
              private route: ActivatedRoute,
              private flightFacadeService: FlightFacadeService,
              private router: Router) {

    this.selectedFlight$ = this.flightFacadeService.getSelectedFlight();
    this.selectedFlight$.subscribe(sf => this.flight = sf);
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ flight }) => {
      this.flightFacadeService.setSelectedFlight(flight);
      this.isLoading = false;
    });
  }

  get isButtonDisabled(): boolean {
    const flight = this.flight;

    return this.isEmpty(flight.airline) ||
        this.isEmpty(flight.flightClass) ||
        this.isEmpty(flight.name) ||
        this.invalidDeparture ||
        this.invalidArrival ||
        (flight.seatNumber > 200 || flight.seatNumber < 0);
  }

  private isEmpty(str: string): boolean {
    return str === '' || str === undefined;
  }

  onDepartureDateChange(date: string): void {
    this.invalidDeparture = false;

    const departure = new Date(date);
    const arrival = new Date(this.flight.arrivalDate);
    const transformed = this.datePipe.transform(date, 'M/d/yy');
    this.flight.departureDate = transformed ?? '';

    if (departure > arrival) {
      this.invalidDeparture = true;
    }
  }

  onArrivalDateChange(date: string): void {
    this.invalidArrival = false

    const arrival = new Date(date);
    const departure = new Date(this.flight.departureDate);
    const transformed = this.datePipe.transform(date, 'M/d/yy');
    this.flight.arrivalDate = transformed ?? '';

    if (arrival < departure) {
      this.invalidArrival = true;
    }
  }

  get departureDateStringToDate(): Date {
    if (this.flight.departureDate) {
      return new Date(this.flight.departureDate);
    }

    return new Date();
  }

  get arrivalDateStringToDate(): Date {
    if (this.flight.arrivalDate) {
      return new Date(this.flight.arrivalDate);
    }

    return new Date();
  }

  updateFlight(flight: Flight): void {
    this.flightFacadeService.updateFlight(flight)
        .subscribe(() => {
          this.router.navigate(['/flights']);
    })
  }

  addFlight(flight: Flight): void {
    flight.id = v4();

    if (!flight.arrivalDate) {
      flight.arrivalDate = this.datePipe.transform(new Date(), 'M/d/yy') ?? '';
    }

    if (!flight.departureDate) {
      flight.departureDate = this.datePipe.transform(new Date(), 'M/d/yy') ?? '';
    }

    this.flightFacadeService.createFlight(flight)
        .subscribe(() =>{
          this.router.navigate(['/flights'])
        });
  }
}
