import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRegisterFormComponent } from './report-register-form.component';

describe('ReportRegisterFormComponent', () => {
  let component: ReportRegisterFormComponent;
  let fixture: ComponentFixture<ReportRegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportRegisterFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
