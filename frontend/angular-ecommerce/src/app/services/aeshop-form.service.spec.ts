import { TestBed } from '@angular/core/testing';

import { AEshopFormService } from './aeshop-form.service';

describe('AEshopFormService', () => {
  let service: AEshopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AEshopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
