import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperscriptComponent } from './superscript.component';

describe('SuperscriptComponent', () => {
  let component: SuperscriptComponent;
  let fixture: ComponentFixture<SuperscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperscriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
