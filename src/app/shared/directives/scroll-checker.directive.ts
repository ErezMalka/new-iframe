import { Directive, OnInit, ElementRef, HostBinding, HostListener, EventEmitter } from '@angular/core';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: '[scrollCheckerDirective]'
})
export class ScrollCheckerDirective implements OnInit {

  public scrollAction = new EventEmitter<any>();

  ngOnInit() {
  }

  constructor() {}

  @HostListener('scroll', ['$event']) private onScroll($event: Event): void {
    //console.log($event.srcElement.scrollLeft, $event.srcElement.scrollTop);
   // this.scrollAction.emit({
     // left: $event.srcElement.scrollLeft,
     // top: $event.srcElement.scrollTop
   // });
  }
}
