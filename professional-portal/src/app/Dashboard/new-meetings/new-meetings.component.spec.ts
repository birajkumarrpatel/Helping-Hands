import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMeetingsComponent } from './new-meetings.component';

describe('NewMeetingsComponent', () => {
  let component: NewMeetingsComponent;
  let fixture: ComponentFixture<NewMeetingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMeetingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
