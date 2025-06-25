import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserShowModalComponent } from './user-show-modal.component';

describe('UserShowModalComponent', () => {
  let component: UserShowModalComponent;
  let fixture: ComponentFixture<UserShowModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserShowModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserShowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
