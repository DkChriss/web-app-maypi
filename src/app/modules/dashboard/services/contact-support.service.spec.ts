import { TestBed } from '@angular/core/testing';

import { ContactSupportService } from './contact-support.service';

describe('ContactSupportService', () => {
  let service: ContactSupportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactSupportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
