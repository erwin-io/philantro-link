import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketDetailsComponent } from './support-ticket-details.component';

describe('SupportTicketDetailsComponent', () => {
  let component: SupportTicketDetailsComponent;
  let fixture: ComponentFixture<SupportTicketDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportTicketDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportTicketDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
