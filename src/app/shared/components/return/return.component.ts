import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})
export class ReturnComponent implements OnInit {

  @Input()
  public color: string;

  @Input()
  public direction: string; // left or right

  @Output()
  public returnAction: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  public returnResult() {
    this.returnAction.emit(true);
  }

  ngOnInit(): void {
    this.direction = this.direction || 'right';
  }

}
