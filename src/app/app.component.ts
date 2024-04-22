import {
  Component,
  effect,
  ElementRef,
  inject,
  Input,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from "@angular/core";
import PSPDFKit, {AnnotationsUnion, Instance, List, ToolbarItem} from "pspdfkit";
import {AnnotationSidebarComponent} from "./annotation-sidebar/annotation-sidebar.component";
import {DataServices} from "./data.services";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["app.component.css"]
})
export class AppComponent {
  title = "PSPDFKit for Web Angular Example";
  data$
  selectedId
  private sidebarAnnotations: Array<Object>;
  private instance: Instance
  transfer = inject(DataServices)
  @ViewChild(AnnotationSidebarComponent, {read: ElementRef}) sideAnnots?: ElementRef<HTMLElement>
  constructor(private dataService: DataServices) {
    this.data$ = this.dataService.getAnnotations;

    effect(() => {
      this.selectedId = this.dataService.selectedAnnotationId()
      const {id, toggle} = this.selectedId
      const selectedAnnotation = this.instance?.getSelectedAnnotations()
      if(!toggle && id === selectedAnnotation?.get(0).id) this.instance?.setSelectedAnnotations(null)
      else this.instance?.setSelectedAnnotations(id)
    });
  }

  setAnnotations(annotations){
    this.dataService.addAnnotations(annotations)
  }
  deleteAnnotations(annotations){
    this.dataService.removeAnnotations(annotations)
  }
  sendUpdateAnnotations(annotations){
    this.dataService.updateAnnotations(annotations)
  }
  showComments(selected: Object){
    this.dataService.showCommentSection(selected)
  }
 async ngAfterViewInit() {
   this.instance = await PSPDFKit.load({
      // Use the assets directory URL as a base URL. PSPDFKit will download its library assets from here.
      baseUrl: location.protocol + "//" + location.host + "/assets/",
      document: "/assets/document.pdf",
      container: "#pspdfkit-container",

    })
     this.instance.setAnnotationCreatorName("Eli")
      //can't make the custom UI work
     this.instance.setCustomUIConfiguration((customUiConfiguration) => ({

        [PSPDFKit.UIElement.Sidebar]: {
          [PSPDFKit.SidebarMode.CUSTOM]({ containerNode }) {
            containerNode.appendChild(this.sideAnnots?.nativeElement);

            return {
              node: containerNode
            };
          }
        }
      }))
      const customAnnotationSidebar = {
        type: "custom",
        title: "Annotation Sidebar",
        dropdownGroup: "sidebar",
        //@ts-ignore
        onPress: ()=> {
          //@ts-ignore
          this.instance.setViewState(viewState=>viewState.set("sidebarMode", "CUSTOM"));

        }
      } as ToolbarItem
      //@ts-ignore

      const toolbarItems = Object.assign([], PSPDFKit.defaultToolbarItems).reduce((acc: Array<ToolbarItem>, item: ToolbarItem) => {
        if (item.type === "sidebar-thumbnails") {
          return acc.concat([item, customAnnotationSidebar]);
        }

        return acc.concat(item);
      }, []);

      this.instance.setToolbarItems([...toolbarItems]);

      //event listeners
      this.instance.addEventListener("annotations.create", annotations => {
        this.sidebarAnnotations = annotations.map(annotation=> PSPDFKit.Annotations.toSerializableObject(annotation)).toJS();
        this.setAnnotations(this.sidebarAnnotations)

      });
      this.instance.addEventListener("annotations.update", annotations => {
        //console.log("create event coordinate", annotations.get(0).toJS())
        this.sidebarAnnotations = annotations.map(annotation=> PSPDFKit.Annotations.toSerializableObject(annotation)).toJS()
        this.sendUpdateAnnotations(this.sidebarAnnotations)
      });
      this.instance.addEventListener("annotations.delete", annotations => {
        this.sidebarAnnotations = annotations.map(annotation=> PSPDFKit.Annotations.toSerializableObject(annotation)).toJS()
        this.deleteAnnotations(this.sidebarAnnotations)
      });

      this.instance.addEventListener("annotationSelection.change", annotation => {
        annotation ? (
          (this.showComments({id: annotation.id, show: true}))
        ): (this.showComments({id: null, show: false}))
      })
  }
}
