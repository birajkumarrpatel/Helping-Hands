import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedMeetingsComponent } from './completed-meetings.component';

describe('CompletedMeetingsComponent', () => {
  let component: CompletedMeetingsComponent;
  let fixture: ComponentFixture<CompletedMeetingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedMeetingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
