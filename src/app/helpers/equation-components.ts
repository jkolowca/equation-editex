import { EquationComponent } from '../components/editor/editor-window/equation/equation.component';
import { EquationService } from '../services/equation.service';

export enum EqComponentTypes {
  Input = 'input',
  Function = 'function',
  Subscript = 'subscript',
  Superscript = 'superscript',
  SubAndSuperscript = 'subandsuperscript',
  Fraction = 'fraction',
  Binominal = 'binominal',
  Matrix = 'matrix',
  Root = 'root'
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

export class RootComponent extends ComplexValueComponent {
  readonly type = EqComponentTypes.Root;
  code = ['\\sqrt', '', ''];

  toString(): string {
    return `${this.code[0]}[${toString(this.value[0])}]${this.code[1]}{${toString(this.value[1])}${this.code[2]}} `;
  }
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
      case 'root':
        return new RootComponent([parseEquation(value[0]), parseEquation(value[1])]);
    }
  });
  return newEquation;
}


export function parseTex(equation: string[] | string): EqComponent[] {
  const newEquation: EqComponent[] = [];
  if (!Array.isArray(equation)) { equation = equation.match(/(\\[a-zA-Z]*|[[\]{}^_]|[0-9\.=+\-a-zA-Z()!|\s]+)/gm); }
  if (equation) {
    equation.forEach((c, i, a) => {
      switch (true) {
        case c === '\\frac':
        case c === '\\binom':
        case c === '\\sqrt': {
          const closing = [];
          closing.push(findClosingBracketIdx(i + 1, a));
          closing.push(findClosingBracketIdx(closing[0] + 1, a));
          const value = [
            parseTex(a.slice(i + 2, closing[0])),
            parseTex(a.slice(closing[0] + 2, closing[1]))
          ] as [EqComponent[], EqComponent[]];
          if (c === '\\frac') { newEquation.push(new FractionComponent(value)); }
          else if (c === '\\binom') { newEquation.push(new BinominalComponent(value)); }
          else if (c === '\\sqrt') { newEquation.push(new RootComponent(value)); }
          a.splice(i + 1, closing[1] - i);
          break;
        }
        case /\\[a-zA-Z]*/.test(c): {
          if (a[i + 1] === '\\limits') { c += a[i + 1]; a.splice(i + 1, 1); }
          newEquation.push(new FunctionComponent(c));
          break;
        }
        case c === '^':
        case c === '_': {
          const closing = [];
          closing.push(findClosingBracketIdx(i + 1, a));
          if (a[closing[0] + 1] === (c === '^' ? '_' : '^')) {
            closing.push(findClosingBracketIdx(closing[0] + 2, a));
            const value = [
              parseTex(a.slice(i + 2, closing[0])),
              parseTex(a.slice(closing[0] + 3, closing[1]))
            ] as [EqComponent[], EqComponent[]];
            newEquation.push(new SubAndSuperscriptComponent(value));
            a.splice(i + 1, closing[1] - i);
            break;
          }
          if (c === '^') { newEquation.push(new SuperscriptComponent(parseTex(a.slice(i + 2, closing[0])))); }
          else { newEquation.push(new SubscriptComponent(parseTex(a.slice(i + 2, closing[0])))); }
          a.splice(i + 1, closing[0] - i);
          break;
        }
        default: {
          newEquation.push(new InputComponent(c));
          break;
        }
      }
    });
  }
  if (!newEquation.length) { newEquation.push(new InputComponent()); }
  if (newEquation[0].type !== 'input') { newEquation.splice(0, 0, new InputComponent()); }
  newEquation.forEach((e, i, a) => {
    if (e.type !== 'input' && (i + 1 === a.length || a[i + 1].type !== 'input')) { a.splice(i + 1, 0, new InputComponent()); }
  });
  return newEquation;
}

function findClosingBracketIdx(o: number, equation: string[]): number {
  const bracket = equation[o];
  if (bracket !== '[' && bracket !== '{') { throw (new Error('Missing opening parenthesis')); }
  const cBracket = bracket === '[' ? ']' : '}';
  let c = o;
  let counter = 1;
  while (counter > 0) {
    const e = equation[++c];
    if (e === bracket) { counter++; }
    else if (e === cBracket) { counter--; }
  }
  return c;
}
