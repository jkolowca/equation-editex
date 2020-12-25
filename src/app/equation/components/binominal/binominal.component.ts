import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BinominalEqComponent } from 'src/app/shared/helpers/equation-components';

@Component({
  selector: 'app-binominal',
  templateUrl: './binominal.component.html',
  styleUrls: ['./binominal.component.scss']
})
export class BinominalComponent implements AfterViewInit {
  @Input() component: BinominalEqComponent;
  @Input() group: FormGroup;
  @Input() path: Array<string>;
  @ViewChild('data') data: ElementRef;
  height = '24px';
  constructor(private changeRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.height = this.data.nativeElement.offsetHeight * 0.6 + 'px';
    this.changeRef.detectChanges();
  }
}
