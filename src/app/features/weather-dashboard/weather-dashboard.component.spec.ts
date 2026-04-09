import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherDashboardComponent } from './weather-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
describe('WeatherDashboardComponent', () => {
  let component: WeatherDashboardComponent;
  let fixture: ComponentFixture<WeatherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherDashboardComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeatherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
