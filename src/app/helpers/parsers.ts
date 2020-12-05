import { zip } from 'rxjs';
import {
  EqComponent,
  InputComponent,
  OperatorComponent,
  SubscriptComponent,
  SuperscriptComponent,
  SubAndSuperscriptComponent,
  FractionComponent,
  BinominalComponent,
  RootComponent,
  MatrixComponent,
  FunctionComponent,
  EqComponentTypes
} from './components';

export function parseEquation(equation: any[]): EqComponent[] {
  const newEquation: EqComponent[] = equation.map(component => {
    const type = component.type;
    let value = component.value;
    if ((value as object).hasOwnProperty('value')) { value = value.value; }
    else if (Array.isArray(value)) { value.map(v => (value as object).hasOwnProperty('value') ? value.value : value); }
    switch (type) {
      case 'input':
        return new InputComponent(value);
      case 'operator':
        return new OperatorComponent(value);
      case 'subscript':
        return new SubscriptComponent(parseEquation(value));
      case 'superscript':
        return new SuperscriptComponent(parseEquation(value));
      case 'function':
        return new FunctionComponent(component.functionCode, value.map(v => parseEquation(v)));
      case 'subandsuperscript':
        return new SubAndSuperscriptComponent([parseEquation(value[0]), parseEquation(value[1])]);
      case 'fraction':
        return new FractionComponent([parseEquation(value[0]), parseEquation(value[1])]);
      case 'binominal':
        return new BinominalComponent([parseEquation(value[0]), parseEquation(value[1])]);
      case 'root':
        return new RootComponent([parseEquation(value[0]), parseEquation(value[1])]);
      case 'matrix':
        return new MatrixComponent(component.matrixType, component.size, value.map(v => parseEquation(v)));
    }
  });
  return newEquation;
}


export function parseTex(equation: string[] | string): EqComponent[] {
  const newEquation: EqComponent[] = [];
  if (!Array.isArray(equation)) { equation = equation.match(/(\\[a-zA-Z]+|[[\]{}^_&]|[0-9\.=+\-a-zA-Z()!|]+(\s[0-9\.=+\-a-zA-Z()!|])*|\\\\)/gm); }
  if (equation) {
    equation.forEach((c, i, a) => {
      switch (true) {
        case c === '\\frac':
        case c === '\\binom':
        case c === '\\sqrt': {
          const value: EqComponent[][] = [];

          let parameterEnds = findClosingBracketIdx(i + 1, a);
          value.push(parseTex(a.splice(i + 2, parameterEnds - i - 2)));
          a.splice(i + 1, 2);

          parameterEnds = findClosingBracketIdx(i + 1, a);
          value.push(parseTex(a.splice(i + 2, parameterEnds - i - 2)));
          a.splice(i + 1, 2);

          if (c === '\\frac') { newEquation.push(new FractionComponent(value)); }
          else if (c === '\\binom') { newEquation.push(new BinominalComponent(value)); }
          else if (c === '\\sqrt') { newEquation.push(new RootComponent(value)); }
          break;
        }
        case c === '\\begin': {
          const matrixType = a.splice(i + 1, 3)[1];
          const matrixLength = a.slice(i + 1).findIndex(e => e === '\\end');
          const matrix = a.slice(i + 1, matrixLength + i + 1);

          a.splice(i + 1, matrixLength + 4);

          const separators = matrix
            .map((e, idx) => ({ value: e, index: idx }))
            .filter(e => e.value === '&' || e.value === '\\\\');

          const size: [number, number] = [0, 0];
          size[1] = separators.findIndex(e => e.value === '\\\\') + 1;
          size[0] = (separators.length + 1) / size[1];

          const values: EqComponent[][] = [];
          let offset = 0;

          separators.forEach(e => {
            values.push(parseTex(matrix.slice(offset, e.index)));
            offset = e.index + 1;
          });
          values.push(parseTex(matrix.slice(offset, matrixLength)));

          newEquation.push(new MatrixComponent(matrixType, size, values));
          break;
        }
        case /\\[a-zA-Z]*/.test(c): {
          if (a[i + 1] === '\\limits') { c += a[i + 1]; a.splice(i + 1, 1); }
          if (a[i + 1] === '{') {
            const values: EqComponent[][] = [];
            do {
              const parameterEnds = findClosingBracketIdx(i + 1, a);
              values.push(parseTex(a.splice(i + 2, parameterEnds - i - 2)));
              a.splice(i + 1, 2);
            } while (a[i + 1] === '{');
            newEquation.push(new FunctionComponent(c, values));
            break;
          }
          newEquation.push(new OperatorComponent(c));
          break;
        }
        case c === '^':
        case c === '_': {
          const value: EqComponent[][] = [];
          if (a[i + 1] === '{') {
            const parameterEnds = findClosingBracketIdx(i + 1, a);
            value.push(parseTex(a.splice(i + 2, parameterEnds - i - 2)));
            a.splice(i + 1, 2);
          } else {
            if (a[i + 1].length > 1) {
              const newElem = a[i + 1].slice(1);
              a[i + 1] = a[i + 1].slice(0, 1);
              a.splice(i + 2, 0, newElem);
            }
            value.push(parseTex(a.splice(i + 1, 1)));
          }
          if (a[i + 1] === (c === '^' ? '_' : '^')) {
            if (a[i + 2] === '{') {
              const parameterEnds = findClosingBracketIdx(i + 2, a);
              value.push(parseTex(a.splice(i + 3, parameterEnds - i - 3)));
              a.splice(i + 2, 2);
            } else {
              value.push(parseTex(a.splice(i + 2, 1)));
            }
            a.splice(i + 1, 1);
            newEquation.push(new SubAndSuperscriptComponent(c === '^' ? value : value.reverse()));
          }
          else { newEquation.push(c === '^' ? new SuperscriptComponent(value[0]) : new SubscriptComponent(value[0])); }
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
