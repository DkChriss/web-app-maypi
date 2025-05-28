import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissigEditFormComponent } from './missig-edit-form.component';

describe('MissigEditFormComponent', () => {
  let component: MissigEditFormComponent;
  let fixture: ComponentFixture<MissigEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissigEditFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissigEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
