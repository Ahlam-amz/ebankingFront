import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyFormComponent } from './currency-form.component';

describe('CurrencyFormComponent', () => {
  let component: CurrencyFormComponent;
  let fixture: ComponentFixture<CurrencyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
