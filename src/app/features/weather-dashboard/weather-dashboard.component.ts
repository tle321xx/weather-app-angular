import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CitySearchComponent } from '../city-search/city-search.component';
import { WeatherResponse, WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule, CitySearchComponent],
  templateUrl: './weather-dashboard.component.html',
  styleUrl: './weather-dashboard.component.scss'
})
export class WeatherDashboardComponent {
  private weatherService = inject(WeatherService);

  weatherData: WeatherResponse | null = null;
  currentCity: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  handleSearch(cityName: string) {
    this.isLoading = true;
    this.errorMessage = ''; // ล้าง Error เก่าออกก่อน
    this.weatherData = null;
    this.currentCity = cityName;

    // 1. หาพิกัด (Lat/Lon) จากชื่อเมืองก่อน
    this.weatherService.getCoordinates(cityName).subscribe({
      next: (geoRes) => {
        if (geoRes.results && geoRes.results.length > 0) {
          const location = geoRes.results[0];
          this.currentCity = `${location.name}, ${location.country}`;
          
          // 2. ได้พิกัดแล้ว เอาไปดึงข้อมูลสภาพอากาศต่อ
          this.fetchWeather(location.latitude, location.longitude);
        } else {
          this.errorMessage = `ไม่พบข้อมูลของเมือง "${cityName}"`;
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  private fetchWeather(lat: number, lon: number) {
    this.weatherService.getWeather(lat, lon).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }
}
