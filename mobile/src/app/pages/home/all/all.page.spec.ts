import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllPage } from './all.page';

describe('AllPage', () => {
  let component: AllPage;
  let fixture: ComponentFixture<AllPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
