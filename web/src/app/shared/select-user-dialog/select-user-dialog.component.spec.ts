import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTenantDialogComponent } from './select-tenant-dialog.component';

describe('SelectTenantDialogComponent', () => {
  let component: SelectTenantDialogComponent;
  let fixture: ComponentFixture<SelectTenantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTenantDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTenantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
