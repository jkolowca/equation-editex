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

export class InputEqComponent extends StringValueComponent {
  readonly type = EqComponentTypes.Input;
}

export class OperatorEqComponent extends StringValueComponent {
  readonly type = EqComponentTypes.Operator;
}

class EquationValueComponent implements EqComponent {
  value: EqComponent[];
  readonly type: EqComponentTypes;
  code: string;

  constructor(value?: EqComponent[]) {
    this.value = value ? value : [new InputEqComponent()];
  }

  toString(): string {
    return `${this.code}{${toString(this.value)}}`;
  }
}

export class SubscriptEqComponent extends EquationValueComponent {
  readonly type = EqComponentTypes.Subscript;
  code = '_';
}

export class SuperscriptEqComponent extends EquationValueComponent {
  readonly type = EqComponentTypes.Superscript;
  code = '^';
}

class ComplexValueComponent implements EqComponent {
  value: EqComponent[][];
  readonly type: EqComponentTypes;
  code: string[];

  constructor(value?: EqComponent[][]) {
    this.value = value ? value : [[new InputEqComponent()], [new InputEqComponent()]];
  }

  toString(): string {
    return `${this.code[0]}{${toString(this.value[0])}}${this.code[1]}{${toString(this.value[1])}${this.code[2]}} `;
  }
}

export class FunctionEqComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Function;
  functionCode: string;
  constructor(code: string, value?: EqComponent[][]) {
    super(value);
    this.functionCode = code;
  }

  toString(): string {
    return this.functionCode + this.value.map(v => '{' + toString(v) + '}').reduce((a, b) => a + b, '');
  }
}

export class SubAndSuperscriptEqComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.SubAndSuperscript;
  code = ['^', '_', ''];
}

export class FractionEqComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Fraction;
  code = ['\\frac', '', ''];
}

export class BinominalEqComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Binominal;
  code = ['\\binom', '', ''];
}

export class RootEqComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Root;
  code = ['\\sqrt', '', ''];

  toString(): string {
    return `${this.code[0]}[${toString(this.value[0])}]${this.code[1]}{${toString(this.value[1])}${this.code[2]}} `;
  }
}

export class MatrixEqComponent extends ComplexValueComponent {
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
        for (let j = 0; j < size[1]; j++) { newValue[i][j] = new InputEqComponent(); }
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
