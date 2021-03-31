import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingJobsComponent } from './upcoming-jobs.component';

describe('UpcomingJobsComponent', () => {
  let component: UpcomingJobsComponent;
  let fixture: ComponentFixture<UpcomingJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
