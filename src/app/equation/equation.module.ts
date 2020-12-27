import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinominalComponent } from './components/binominal/binominal.component';
import { EquationComponent } from './components/equation/equation.component';
import { FractionComponent } from './components/fraction/fraction.component';
import { FunctionComponent } from './components/function/function.component';
import { InputComponent } from './components/input/input.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { OperatorComponent } from './components/operator/operator.component';
import { RootComponent } from './components/root/root.component';
import { SubandsuperscriptComponent } from './components/subandsuperscript/subandsuperscript.component';
import { SubscriptComponent } from './components/subscript/subscript.component';
import { SuperscriptComponent } from './components/superscript/superscript.component';
import { SharedModule } from '../shared/shared.module';
import { KatexModule } from 'ng-katex';
import { ContenteditableValueAccessorModule } from '@tinkoff/angular-contenteditable-accessor';

const exports = [
  EquationComponent
];

@NgModule({
  declarations: [
    ...exports,
    BinominalComponent,
    FractionComponent,
    FunctionComponent,
    InputComponent,
    MatrixComponent,
    OperatorComponent,
    RootComponent,
    SubandsuperscriptComponent,
    SubscriptComponent,
    SuperscriptComponent
  ],
  exports: [...exports],
  imports: [
    CommonModule,
    SharedModule,
    KatexModule,
    ContenteditableValueAccessorModule,
  ]
})
export class EquationModule { }
