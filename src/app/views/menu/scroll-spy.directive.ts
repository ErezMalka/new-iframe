import { Directive, Injectable, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[scrollSpy]'
})
export class ScrollSpyDirective {
  @Input() public spiedTags = [];
  @Output() public sectionChange = new EventEmitter<string>();
  private currentSection: string;

  constructor(private _el: ElementRef) {}

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    let currentSection: string;
    const children = this._el.nativeElement.children;
    const scrollTop = event.target.scrollTop;
    const parentOffset = event.target.offsetTop;
   // console.log("scrollTop",scrollTop);
    // console.log("parentOffset",parentOffset);
    for (let i = 0; i < children.length; i++) {
        const element = children[i];
        if (this.spiedTags.some(spiedTag => spiedTag === element.tagName)) {
          // console.log("spyscroll:element.tagName: ", element.tagName);
          // console.log(scrollTop);
           //console.log(element.offsetTop);
           // console.log(parentOffset);
            if ((element.offsetTop - 215) <= window.pageYOffset) {

                currentSection = element.id;
              //  console.log("currentSection: "+ currentSection, "element.offsetTop: "+ element.offsetTop);
              //  console.log("spyscroll:currentSection: ", currentSection);
            }
        }
    }
    if (currentSection !== this.currentSection) {
      //console.log("currentSection: "+ currentSection, "this.currentSection: "+ this.currentSection);
        this.currentSection = currentSection;
        this.sectionChange.emit(this.currentSection);
    }
}

}
