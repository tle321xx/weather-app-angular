import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { WeatherResponse } from '../../../core/services/weather.service';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.scss'
})
export class WeatherCardComponent {
  @Input({ required: true }) weather!: WeatherResponse;
  @Input({ required: true }) cityName: string = '';
}
