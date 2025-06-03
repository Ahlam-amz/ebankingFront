import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEnrollementFormComponent } from './client-enrollement-form.component';

describe('ClientEnrollementFormComponent', () => {
  let component: ClientEnrollementFormComponent;
  let fixture: ComponentFixture<ClientEnrollementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientEnrollementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientEnrollementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
