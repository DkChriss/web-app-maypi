import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyContactRegisterFormComponent } from './emergency-contact-register-form.component';

describe('EmergencyContactRegisterFormComponent', () => {
  let component: EmergencyContactRegisterFormComponent;
  let fixture: ComponentFixture<EmergencyContactRegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyContactRegisterFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmergencyContactRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
