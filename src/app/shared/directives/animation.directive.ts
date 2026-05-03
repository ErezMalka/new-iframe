import {Directive, ElementRef, HostListener, Input, OnDestroy} from '@angular/core';
import { interval } from 'rxjs';

@Directive({
  selector: '[animation]'
})
export class AnimationDirective implements OnDestroy {

  constructor(private el: ElementRef) { }

  private defaultAnimation = 'animated';

  private timer: any;

  @Input('animation')
  animation: string;

  @HostListener('click') onMouseEnter() {
    this.action(this.animation || '');
  }

  private action(animation: string) {
    if (this.el.nativeElement.className.indexOf(this.defaultAnimation + ' ' + animation) !== -1) {
      this.el.nativeElement.className = this.el.nativeElement.className.replace(new RegExp(' ' + this.defaultAnimation + ' ' + animation,'g'), '');
    }
    this.timer = setTimeout(() => {
      this.el.nativeElement.className = this.el.nativeElement.className + ' ' + this.defaultAnimation + ' ' + animation;
    }, 100);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
