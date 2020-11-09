import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentBarComponent } from './document-bar.component';

describe('EquationMenuComponent', () => {
  let component: DocumentBarComponent;
  let fixture: ComponentFixture<DocumentBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
