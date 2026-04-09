import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitySearchComponent } from './city-search.component';

describe('CitySearchComponent', () => {
  let component: CitySearchComponent;
  let fixture: ComponentFixture<CitySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitySearchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ควรถูกสร้างขึ้นมาได้อย่างถูกต้อง (should create)', () => {
    expect(component).toBeTruthy();
  });

  it('ควรส่งข้อมูลชื่อเมืองออกไป (emit) เมื่อมีการเรียกใช้ onSearch ด้วยชื่อเมืองที่ถูกต้อง', () => {
    // ดักจับ (Spy) การทำงานของ EventEmitter
    spyOn(component.search, 'emit');
    
    // จำลองการค้นหาเมือง
    component.onSearch('Bangkok');
    
    // ตรวจสอบว่ามีการส่งคำว่า 'Bangkok' ออกไปจริงๆ
    expect(component.search.emit).toHaveBeenCalledWith('Bangkok');
  });

  it('ต้องไม่ส่งข้อมูลออกไป หากผู้ใช้ไม่ได้พิมพ์อะไรเลย หรือพิมพ์แค่ช่องว่าง', () => {
    spyOn(component.search, 'emit');
    
    // จำลองการค้นหาด้วยช่องว่าง
    component.onSearch('   ');
    
    // ตรวจสอบว่าระบบต้องไม่ทำงาน (ไม่ปล่อย Event)
    expect(component.search.emit).not.toHaveBeenCalled();
  });
});