import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharityPage } from './charity.page';

describe('CharityPage', () => {
  let component: CharityPage;
  let fixture: ComponentFixture<CharityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
