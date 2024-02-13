import { TestBed } from '@angular/core/testing';

import { FlightHttpService } from './flight-http.service';

describe('FlightHttpService', () => {
  let service: FlightHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
