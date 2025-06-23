import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignPermissionsFormComponent } from './user-assign-permissions-form.component';

describe('UserAssignPermissionsFormComponent', () => {
  let component: UserAssignPermissionsFormComponent;
  let fixture: ComponentFixture<UserAssignPermissionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAssignPermissionsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAssignPermissionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
