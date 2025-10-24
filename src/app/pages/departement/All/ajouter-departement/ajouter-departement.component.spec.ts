import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterDepartementComponent } from './ajouter-departement.component';

describe('AjouterDepartementComponent', () => {
  let component: AjouterDepartementComponent;
  let fixture: ComponentFixture<AjouterDepartementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterDepartementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterDepartementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
