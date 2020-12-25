import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinominalComponent } from './binominal.component';

describe('BinominalComponent', () => {
  let component: BinominalComponent;
  let fixture: ComponentFixture<BinominalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinominalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BinominalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
