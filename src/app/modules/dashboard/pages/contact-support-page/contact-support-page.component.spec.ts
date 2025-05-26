import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSupportPageComponent } from './contact-support-page.component';

describe('ContactSupportPageComponent', () => {
  let component: ContactSupportPageComponent;
  let fixture: ComponentFixture<ContactSupportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSupportPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactSupportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
