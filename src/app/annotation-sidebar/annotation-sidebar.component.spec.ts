import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationSidebarComponent } from './annotation-sidebar.component';

describe('AnnotationSidebarComponent', () => {
  let component: AnnotationSidebarComponent;
  let fixture: ComponentFixture<AnnotationSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnotationSidebarComponent]
    });
    fixture = TestBed.createComponent(AnnotationSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
