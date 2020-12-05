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
  MatrixComponent
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
        case c === '\\begin': {
          const matrixType = a[i + 2];
          a.splice(i + 1, 3);
          console.log(a);
          const matrixEnd = a.slice(i).findIndex(e => e === '\\end');
          console.log(matrixEnd);
          const separators = a.slice(i, matrixEnd)
            .map((e, idx) => ({ value: e, index: idx }))
            .filter(e => e.value === '&' || e.value === '\\\\');
          console.log(separators);
          const size: [number, number] = [0, 0];
          size[1] = separators.findIndex(e => e.value === '\\\\') + 1;
          size[0] = (separators.length + 1) / size[1];
          console.log(size);
          const values: EqComponent[][] = [];
          let offset = 1;
          separators.forEach(e => {
            console.log(i + offset, e.index);
            values.push(parseTex(a.slice(i + offset, e.index)));
            offset = e.index + 1;
          });
          values.push(parseTex(a.slice(i + offset, matrixEnd)));
          a.splice(i + 1, matrixEnd + 3);
          newEquation.push(new MatrixComponent(matrixType, size, values));
          break;
        }
        case /\\[a-zA-Z]*/.test(c): {
          if (a[i + 1] === '\\limits') { c += a[i + 1]; a.splice(i + 1, 1); }
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
