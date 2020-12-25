import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatrixEqComponent } from 'src/app/shared/helpers/equation-components';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements AfterViewInit, OnChanges {
  @Input() matrix: MatrixEqComponent;
  @Input() group: FormGroup;
  @Input() path: Array<string>;
  @ViewChild('data') data: ElementRef;
  height = '24px';
  parenthesis: string[] = ['', ''];
  constructor(private changeRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.matrix.matrixType) {
      case 'pmatrix':
        this.parenthesis = ['(', ')'];
        break;
      case 'bmatrix':
        this.parenthesis = ['[', ']'];
        break;
      case 'Bmatrix':
        this.parenthesis = ['\\{', '\\}'];
        break;
      case 'vmatrix':
        this.parenthesis = ['\\vert', '\\vert'];
        break;
      case 'Vmatrix':
        this.parenthesis = ['\\Vert', '\\Vert'];
        break;
      default:
        this.parenthesis = ['', ''];
    }
  }

  ngAfterViewInit(): void {
    this.height = this.data.nativeElement.offsetHeight * 0.8 + 'px';
    this.changeRef.detectChanges();
  }
}
