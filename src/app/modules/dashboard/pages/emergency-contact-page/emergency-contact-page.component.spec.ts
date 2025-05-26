import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyContactPageComponent } from './emergency-contact-page.component';

describe('EmergencyContactPageComponent', () => {
  let component: EmergencyContactPageComponent;
  let fixture: ComponentFixture<EmergencyContactPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyContactPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmergencyContactPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
