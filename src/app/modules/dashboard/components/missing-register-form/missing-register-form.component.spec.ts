import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingRegisterFormComponent } from './missing-register-form.component';

describe('MissingRegisterFormComponent', () => {
  let component: MissingRegisterFormComponent;
  let fixture: ComponentFixture<MissingRegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingRegisterFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissingRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
