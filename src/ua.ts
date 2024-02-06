import * as IO from 'fp-ts/IO';
import {UAParser} from 'ua-parser-js';

export const detect: IO.IO<void> = () => {
  const uaParser = new UAParser();
  const data = uaParser.getResult();

  return console.log(data);
};
