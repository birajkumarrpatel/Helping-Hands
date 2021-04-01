import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledWorkComponent } from './scheduled-work.component';

describe('ScheduledWorkComponent', () => {
  let component: ScheduledWorkComponent;
  let fixture: ComponentFixture<ScheduledWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
