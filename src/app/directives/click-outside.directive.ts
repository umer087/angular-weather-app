import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor(private el : ElementRef) { }

  @Output () public clickOutSide = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(target : any) {
    const clickedInside = this.el.nativeElement.contains(target);
    if(!clickedInside)
      this.clickOutSide.emit(target);
  }

}
