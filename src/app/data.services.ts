import { BehaviorSubject } from 'rxjs';
import {booleanAttribute, Injectable, signal} from "@angular/core";
import {List} from "pspdfkit";

@Injectable({
  providedIn: 'root'
})
export class DataServices{

  private annotations$ = new BehaviorSubject([])
  private selectedAnnotations$ = new BehaviorSubject({id: null, show: false})
  selectedAnnotationId = signal({})

  getAnnotations = this.annotations$.asObservable()
  getSelectedAnnotation = this.selectedAnnotations$.asObservable()
  constructor() {
  }
  addAnnotations(message: []){
    let allSidebarAnnotations = this.annotations$.getValue()
    this.annotations$.next([...allSidebarAnnotations, ...message])

  }
  updateAnnotations(annotations){
    let allSidebarAnnotations = this.annotations$.getValue().map(currentAnnotation =>{
      annotations.forEach(updateAnnotation => {
        currentAnnotation.id === updateAnnotation.id && (currentAnnotation = updateAnnotation)
      })
      return currentAnnotation
    })
    this.annotations$.next([...allSidebarAnnotations])
  }
  removeAnnotations(annotations: any[]){
    let allSidebarAnnotations = this.annotations$.getValue().filter(delAnnotation => !annotations.some(currentAnnotation => delAnnotation.id === currentAnnotation.id))
     this.annotations$.next(allSidebarAnnotations)
  }

  showCommentSection(annotations){
    this.selectedAnnotations$.next(annotations)
  }
  sendSelectedAnnotationId(id: string, toggle){
    return this.selectedAnnotationId.update((val)=>{
      val = {id: id, toggle: toggle}
      return val;
    })
  }

}
