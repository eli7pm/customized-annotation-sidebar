import {Component, ElementRef, inject, Input, Output, signal, ViewChild} from '@angular/core';
import {DataServices} from "../data.services";

@Component({
  selector: 'app-annotation-sidebar',
  templateUrl: './annotation-sidebar.component.html',
  styleUrls: ['./annotation-sidebar.component.css']
})
export class AnnotationSidebarComponent  {
  data$
  selectedAnnotations
  regex = /pspdfkit\/\w+\/|pspdfkit\//g
  transfer = inject(DataServices)

  constructor(private dataService: DataServices) {
    this.data$ = this.dataService.getAnnotations
    this.selectedAnnotations = this.dataService.getSelectedAnnotation

  }
  showCurrentComment(annotationId){
    const {id, show} = this.selectedAnnotations.source._value
    if(id === annotationId) return true
    else return false;
  }
  showOnClick(annotationId){
    const {id, show} = this.selectedAnnotations.source._value
    if(!show && id !== annotationId){
      this.dataService.showCommentSection({id: annotationId, show: true})
      this.transfer.sendSelectedAnnotationId(annotationId, true)
    } else { this.dataService.showCommentSection({id: annotationId, show: false})
      this.transfer.sendSelectedAnnotationId(annotationId, false)
    }
  }
}
