import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubandsuperscriptComponent } from './subandsuperscript.component';

describe('SubandsuperscriptComponent', () => {
  let component: SubandsuperscriptComponent;
  let fixture: ComponentFixture<SubandsuperscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubandsuperscriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubandsuperscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
