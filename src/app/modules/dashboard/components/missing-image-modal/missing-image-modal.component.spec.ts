import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingImageModalComponent } from './missing-image-modal.component';

describe('MissingImageModalComponent', () => {
  let component: MissingImageModalComponent;
  let fixture: ComponentFixture<MissingImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingImageModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissingImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
