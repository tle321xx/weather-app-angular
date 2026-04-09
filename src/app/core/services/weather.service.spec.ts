import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService, WeatherResponse } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // ใช้สำหรับจำลองการเรียก HTTP
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // ตรวจสอบว่าไม่มี HTTP Request ตัวไหนที่ค้างอยู่หลังจากเทสต์จบ
    httpMock.verify();
  });

  it('ควรถูกสร้างขึ้นมาได้อย่างถูกต้อง (should be created)', () => {
    expect(service).toBeTruthy();
  });

  it('ควรดึงข้อมูลสภาพอากาศได้อย่างถูกต้องผ่าน GET method', () => {
    // 1. เตรียมข้อมูลจำลอง (Mock Data)
    const mockWeather: WeatherResponse = {
      latitude: 13.75,
      longitude: 100.5167,
      current_weather: { temperature: 32, windspeed: 15, weathercode: 0 }
    };

    // 2. เรียกใช้งาน Service
    service.getWeather(13.75, 100.5167).subscribe(weather => {
      // ตรวจสอบผลลัพธ์ว่าตรงกับที่จำลองไว้หรือไม่
      expect(weather.current_weather.temperature).toBe(32);
      expect(weather).toEqual(mockWeather);
    });

    // 3. ดักจับ Request ที่ถูกส่งออกไป
    const req = httpMock.expectOne(request => request.url.includes('api.open-meteo.com'));
    
    // ตรวจสอบว่าเป็น GET method
    expect(req.request.method).toBe('GET');
    
    // ตอบกลับ Request ด้วยข้อมูลจำลองที่เราเตรียมไว้
    req.flush(mockWeather);
  });
});