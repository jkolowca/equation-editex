import { Component, OnInit } from '@angular/core';
import ToolbarContent from './toolbar.json';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  toolbar: any;

  constructor() { this.toolbar = ToolbarContent; }

  ngOnInit(): void {
  }

}
