import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePostOfficeComponent } from './home-post-office.component';

describe('HomePostOfficeComponent', () => {
  let component: HomePostOfficeComponent;
  let fixture: ComponentFixture<HomePostOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePostOfficeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePostOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
