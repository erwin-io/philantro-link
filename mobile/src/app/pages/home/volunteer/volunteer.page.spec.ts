import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolunteerPage } from './volunteer.page';

describe('VolunteerPage', () => {
  let component: VolunteerPage;
  let fixture: ComponentFixture<VolunteerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
