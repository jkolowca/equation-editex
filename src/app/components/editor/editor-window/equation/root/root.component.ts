import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RootEqComponent } from 'src/app/helpers/equation-components';

@Component({
  selector: 'app-root-c',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements AfterViewInit {
  @Input() component: RootEqComponent;
  @Input() group: FormGroup;
  @Input() path: Array<string>;
  @ViewChild('rootValue') root: ElementRef;

  height = '24px';
  constructor(private changeRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.height = this.root.nativeElement.offsetHeight * 0.8 + 'px';
    this.changeRef.detectChanges();
  }
}
