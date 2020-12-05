import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {
  @Output() filterChanged = new EventEmitter<string>();
  form = new FormGroup({ filter: new FormControl('') });

  constructor() { this.form.valueChanges.subscribe(v => this.filterChanged.emit(v.filter)); }
}
