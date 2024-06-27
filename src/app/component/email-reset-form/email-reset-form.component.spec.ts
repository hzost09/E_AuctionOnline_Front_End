import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailResetFormComponent } from './email-reset-form.component';

describe('EmailResetFormComponent', () => {
  let component: EmailResetFormComponent;
  let fixture: ComponentFixture<EmailResetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailResetFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailResetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
