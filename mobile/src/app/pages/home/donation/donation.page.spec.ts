import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonationPage } from './donation.page';

describe('DonationPage', () => {
  let component: DonationPage;
  let fixture: ComponentFixture<DonationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
