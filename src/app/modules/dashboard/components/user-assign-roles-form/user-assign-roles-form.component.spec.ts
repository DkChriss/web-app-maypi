import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignRolesFormComponent } from './user-assign-roles-form.component';

describe('UserAssignRolesFormComponent', () => {
  let component: UserAssignRolesFormComponent;
  let fixture: ComponentFixture<UserAssignRolesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAssignRolesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAssignRolesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
