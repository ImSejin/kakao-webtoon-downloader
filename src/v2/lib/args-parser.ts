// type ParameterKey = 'id' | 'offset' | 'limit';
type Parameters = { [key: string]: boolean | string | number };

/**
 * Parses arguments as an object.
 *
 * @example
 * // {alpha:2, beta='A=B=C', exGamma: true, D: 'false', delTa: -3.14}
 * alpha=2 beta=A=B=C ex-gamma D=false del_ta=-3.14
 *
 * // Error
 * Alpha=2 Ex-gamma
 */
const parseArguments = (args: string[]): Parameters => {
  const regexp = /^(?<key>[A-Z](?!\w+)|[a-z][a-zA-Z0-9_-]*)(?:=(?<value>.+))?/;
  const parameters = args.slice(2);

  const result: Parameters = {};

  for (const parameter of parameters) {
    const execArray = regexp.exec(parameter);
    if (!execArray) {
      throw new Error(`Invalid argument: ${parameter}`);
    }

    let { key, value = true } = execArray.groups;

    // Converts kebab/snake case into camel case.
    if (/[_-]/.test(key)) {
      key = key.replace(/[_-]([a-z0-9])/g, (_, letter) => letter.toUpperCase());
    }

    if (result[key]) {
      throw new Error(`Duplicated arguments: ${key}`);
    }

    if (typeof value === 'boolean') {
      result[key] = true;
    } else {
      const number = Number(value);
      result[key] = Number.isNaN(number) ? value : number;
    }
  }

  return result;
};

export { parseArguments };
