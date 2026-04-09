// src/app/core/services/weather/weather.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// ประกาศ Interface เพื่อกำหนดโครงสร้างข้อมูล (TypeScript Best Practice)
export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

export interface GeocodingResponse {
  results?: {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiUrl = environment.weatherApiBaseUrl;

  private weatherCache = new Map<string, { data: WeatherResponse, timestamp: number }>();
  private CACHE_DURATION_MS = 5 * 60 * 1000; // ตั้งค่า Cache ไว้ที่ 5 นาที

  /**
   * ดึงข้อมูลสภาพอากาศตามพิกัด (Latitude, Longitude)
   * @param lat ละติจูด
   * @param lon ลองจิจูด
   */
getWeather(lat: number, lon: number): Observable<WeatherResponse> {
    const cacheKey = `${lat},${lon}`;
    const cachedItem = this.weatherCache.get(cacheKey);

    // ตรวจสอบว่ามี Cache และยังไม่หมดอายุ (ภายใน 5 นาที) หรือไม่
    if (cachedItem && (Date.now() - cachedItem.timestamp < this.CACHE_DURATION_MS)) {
      console.log('✅ โหลดข้อมูลจาก Cache (ไม่ยิง API ใหม่)');
      return of(cachedItem.data); // ส่งข้อมูลจาก Cache กลับไปทันที
    }

    const url = `${this.apiUrl}?latitude=${lat}&longitude=${lon}&current_weather=true`;
    
    return this.http.get<WeatherResponse>(url).pipe(
      tap(data => {
        // เมื่อได้ข้อมูลจาก API มาใหม่ ให้บันทึกลง Cache
        console.log('🌐 โหลดข้อมูลจาก API และบันทึกลง Cache');
        this.weatherCache.set(cacheKey, { data, timestamp: Date.now() });
      }),
      catchError(this.handleError)
    );
  }

  /**
   * ระบบจัดการข้อผิดพลาด (Error Handling)
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง';
    
    if (error.error instanceof ErrorEvent) {
      // กรณีเกิด Error ฝั่ง Client (เช่น เน็ตหลุด)
      errorMessage = `ปัญหาจากฝั่งผู้ใช้: ${error.error.message}`;
    } else {
      // กรณีเกิด Error ฝั่ง Server (เช่น API ล่ม, พารามิเตอร์ผิด)
      errorMessage = `เซิร์ฟเวอร์แจ้งเตือนรหัส: ${error.status}\nข้อความ: ${error.message}`;
    }
    
    // พิมพ์ Error ลง Console เพื่อให้ Developer ตรวจสอบ (Documentation / Debugging)
    console.error('WeatherService Error:', errorMessage);
    
    // ส่ง Error กลับไปให้ Component เพื่อนำไปแสดงผลบนหน้าจอ
    return throwError(() => new Error(errorMessage));
  }

  /**
   * ค้นหาพิกัด (Lat, Lon) จากชื่อเมือง
   * @param cityName ชื่อเมืองที่ต้องการค้นหา
   */
  getCoordinates(cityName: string): Observable<GeocodingResponse> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
    return this.http.get<GeocodingResponse>(url).pipe(
      catchError(this.handleError)
    );
  }
}

