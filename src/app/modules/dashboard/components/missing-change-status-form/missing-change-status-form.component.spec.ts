import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingChangeStatusFormComponent } from './missing-change-status-form.component';

describe('MissingChangeStatusFormComponent', () => {
  let component: MissingChangeStatusFormComponent;
  let fixture: ComponentFixture<MissingChangeStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingChangeStatusFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissingChangeStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
