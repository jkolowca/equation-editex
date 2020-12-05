export enum EqComponentTypes {
  Input = 'input',
  Function = 'function',
  Operator = 'operator',
  Subscript = 'subscript',
  Superscript = 'superscript',
  SubAndSuperscript = 'subandsuperscript',
  Fraction = 'fraction',
  Binominal = 'binominal',
  Matrix = 'matrix',
  Root = 'root'
}

export function toString(equation: EqComponent[]): string {
  return equation.map(c => c.toString()).reduce((a, b) => a + ' ' + b, '');
}

export abstract class EqComponent {
  value: string | EqComponent[] | EqComponent[][];
  readonly type: EqComponentTypes;

  abstract toString(): string;
}

class StringValueComponent implements EqComponent {
  value: string;
  readonly type: EqComponentTypes;

  constructor(value?: string) { this.value = value ? value : ''; }

  toString(): string {
    return this.value.length ? this.value + ' ' : '';
  }
}

export class InputComponent extends StringValueComponent {
  readonly type = EqComponentTypes.Input;
}

export class OperatorComponent extends StringValueComponent {
  readonly type = EqComponentTypes.Operator;
}

class EquationValueComponent implements EqComponent {
  value: EqComponent[];
  readonly type: EqComponentTypes;
  code: string;

  constructor(value?: EqComponent[]) {
    this.value = value ? value : [new InputComponent()];
  }

  toString(): string {
    return `${this.code}{${toString(this.value)}}`;
  }
}

export class SubscriptComponent extends EquationValueComponent {
  readonly type = EqComponentTypes.Subscript;
  code = '_';
}

export class SuperscriptComponent extends EquationValueComponent {
  readonly type = EqComponentTypes.Superscript;
  code = '^';
}

class ComplexValueComponent implements EqComponent {
  value: EqComponent[][];
  readonly type: EqComponentTypes;
  code: string[];

  constructor(value?: EqComponent[][]) {
    this.value = value ? value : [[new InputComponent()], [new InputComponent()]];
  }

  toString(): string {
    return `${this.code[0]}{${toString(this.value[0])}}${this.code[1]}{${toString(this.value[1])}${this.code[2]}} `;
  }
}

export class SubAndSuperscriptComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.SubAndSuperscript;
  code = ['^', '_', ''];
}

export class FractionComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Fraction;
  code = ['\\frac', '', ''];
}

export class BinominalComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Binominal;
  code = ['\\binom', '', ''];
}

export class RootComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Root;
  code = ['\\sqrt', '', ''];

  toString(): string {
    return `${this.code[0]}[${toString(this.value[0])}]${this.code[1]}{${toString(this.value[1])}${this.code[2]}} `;
  }
}

export class MatrixComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Matrix;
  size: [number, number];
  matrixType: string;
  constructor(matrixType: string, size: [number, number], value?: EqComponent[][]) {
    super(value);
    this.size = size;
    this.matrixType = matrixType;
    if (!value) {
      const newValue = [];
      for (let i = 0; i < size[0]; i++) {
        value[i] = [];
        for (let j = 0; j < size[1]; j++) { newValue[i][j] = new InputComponent(); }
      }
      this.value = newValue;
    }
  }
  toString(): string {
    const values = this.value.map((v, i, a) => {
      if (i + 1 === a.length) {
        return toString(v);
      }
      if ((i + 1) % this.size[1]) {
        return toString(v) + '&';
      }
      return toString(v) + '\\\\';
    }).reduce((a, b) => a + b, '');
    return `\\begin{${this.matrixType}} ${values} \\end{${this.matrixType}}`;
  }
}
