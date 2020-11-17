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

export function toString(equation: EqComponent[]): string {
  return equation.map(c => c.toString()).reduce((a, b) => a + b, '');
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

export class FunctionComponent extends StringValueComponent {
  readonly type = EqComponentTypes.Function;
}

class EquationValueComponent implements EqComponent {
  value: EqComponent[];
  readonly type: EqComponentTypes;
  code: string;

  constructor(value?: EqComponent[]) {
    this.value = value ? value : [new InputComponent()];
  }

  toString(): string {
    return `${this.code}{${toString(this.value)}} `;
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

  constructor(value?: [EqComponent[], EqComponent[]]) {
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

export function parseEquation(equation: any[]): EqComponent[] {
  const newEquation: EqComponent[] = equation.map(component => {
    const type = component.type;
    let value = component.value;
    if ((value as object).hasOwnProperty('value')) { value = value.value; }
    else if (Array.isArray(value)) { value.map(v => (value as object).hasOwnProperty('value') ? value.value : value); }
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
  return newEquation;
}
