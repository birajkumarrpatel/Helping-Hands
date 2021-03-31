import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProfessionalComponent } from './search-professional.component';

describe('SearchProfessionalComponent', () => {
  let component: SearchProfessionalComponent;
  let fixture: ComponentFixture<SearchProfessionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchProfessionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
