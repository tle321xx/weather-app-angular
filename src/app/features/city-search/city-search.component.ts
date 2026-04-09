import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [],
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.scss'
})
export class CitySearchComponent {
  // ส่งค่าชื่อเมืองที่พิมพ์กลับไปให้ Component แม่ (Dashboard)
  @Output() search = new EventEmitter<string>();

  onSearch(city: string) {
    if (city.trim()) {
      this.search.emit(city.trim());
    }
  }
}
