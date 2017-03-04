/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BackendServiceService } from './backend-service.service';

describe('BackendServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendServiceService]
    });
  });

  it('should ...', inject([BackendServiceService], (service: BackendServiceService) => {
    expect(service).toBeTruthy();
  }));
});
