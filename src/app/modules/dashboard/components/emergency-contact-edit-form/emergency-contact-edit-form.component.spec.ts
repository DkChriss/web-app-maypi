import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyContactEditFormComponent } from './emergency-contact-edit-form.component';

describe('EmergencyContactEditFormComponent', () => {
  let component: EmergencyContactEditFormComponent;
  let fixture: ComponentFixture<EmergencyContactEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyContactEditFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmergencyContactEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
