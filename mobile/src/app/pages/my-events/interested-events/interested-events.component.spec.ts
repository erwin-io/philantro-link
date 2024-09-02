import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterestedEventsPage } from './interested-events.component';

describe('InterestedEventsPage', () => {
  let component: InterestedEventsPage;
  let fixture: ComponentFixture<InterestedEventsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestedEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
