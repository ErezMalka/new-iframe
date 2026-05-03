import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input()
  public show: boolean = false;

  @Input()
  public color: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
