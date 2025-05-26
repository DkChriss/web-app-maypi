import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRegisterFormComponent } from './device-register-form.component';

describe('DeviceRegisterFormComponent', () => {
  let component: DeviceRegisterFormComponent;
  let fixture: ComponentFixture<DeviceRegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceRegisterFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeviceRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
