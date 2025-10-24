import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDepartementComponent } from './details-departement.component';

describe('DetailsDepartementComponent', () => {
  let component: DetailsDepartementComponent;
  let fixture: ComponentFixture<DetailsDepartementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsDepartementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsDepartementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
