export enum EqComponentTypes {
  Input = 'input',
  Function = 'function',
  Subscript = 'subscript',
  Superscript = 'superscript',
  SubAndSuperscript = 'subandsuperscript',
  Fraction = 'fraction',
  Binominal = 'binominal',
  Matrix = 'matrix'
}

export abstract class EqComponent {
  value: string | Equation | Equation[];
  readonly type: EqComponentTypes;

  abstract toString(): string;
}

export class Equation {
  value: EqComponent[];

  constructor(value?: EqComponent[]) {
    this.value = value ? value : [new InputComponent()];
  }

  toString(): string {
    return this.value.map(e => e.toString()).reduce((a, b) => a + b);
  }
}

class StringValueComponent implements EqComponent {
  value: string;
  readonly type: EqComponentTypes;

  constructor(value?: string) { this.value = value ? value : ''; }

  toString(): string {
    return this.value + ' ';
  }
}

export class InputComponent extends StringValueComponent {
  readonly type = EqComponentTypes.Input;
}

export class FunctionComponent extends StringValueComponent {
  readonly type = EqComponentTypes.Function;
}

class EquationValueComponent implements EqComponent {
  value: Equation;
  readonly type: EqComponentTypes;
  code: string;

  constructor(value?: Equation | EqComponent[]) {
    this.value = value ? value instanceof Equation ? value : new Equation(value) : new Equation();
  }

  toString(): string {
    return `${this.code}{${this.value.toString()}}`;
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
  value: Equation[];
  readonly type: EqComponentTypes;
  code: [string, string, string];

  constructor(value?: [EqComponent[] | Equation, EqComponent[] | Equation]) {
    this.value = value ? [
      value[0] instanceof Equation ? value[0] : new Equation(value[0]),
      value[1] instanceof Equation ? value[1] : new Equation(value[1])
    ] : [new Equation(), new Equation()];
  }

  toString(): string {
    return `${this.code[0]}{${this.value[0].toString()}}${this.code[1]}{${this.value[1].toString()}${this.code[2]}`;
  }
}

export class SubAndSuperscriptComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.SubAndSuperscript;
  code: ['^', '_', ''];
}

export class FractionComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Fraction;
  code: ['\\frac', '', ''];
}

export class BinominalComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Binominal;
  code: ['\\binom', '', ''];
}

export function parseEquation(equation: any[]): Equation {
  const newEquation: EqComponent[] = equation.map(component => {
    const type = component.type;
    const value = component.value;
    switch (type) {
      case 'input':
        return new InputComponent(value);
      case 'function':
        return new FunctionComponent(value);
      case 'subscript':
        return new SubscriptComponent(parseEquation(value));
      case 'superscript':
        return new SuperscriptComponent(parseEquation(value));
      case 'subandsuperscript':
        return new SubAndSuperscriptComponent([parseEquation(value[0]), parseEquation(value[1])]);
      case 'fraction':
        return new FractionComponent([parseEquation(value[0]), parseEquation(value[1])]);
      case 'binominal':
        return new BinominalComponent([parseEquation(value[0]), parseEquation(value[1])]);
    }
  });
  return new Equation(newEquation);
}
