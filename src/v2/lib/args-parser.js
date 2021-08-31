'use strict';

/**
 1. --port=8080
 2. -p=8080
 3. --debug
 4. -D
 */
const regex = /^(?<prefix>-{1,2})\w+=?/;

exports.parseArguments = args => args.slice(2)
    .filter(it => regex.test(it))
    .map(it => {
      const matched = it.match(regex);
      const arr = matched.input.replace(matched.groups.prefix, '').split('=');

      return {[arr[0]]: arr[1] || true};
    })
    .reduce((acc, cur) => ({...acc, ...cur}), {});
