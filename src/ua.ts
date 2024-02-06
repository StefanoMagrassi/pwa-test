import * as IO from 'fp-ts/IO';
import {UAParser, type IResult} from 'ua-parser-js'; // ref. https://github.com/faisalman/ua-parser-js/issues/680

export const detect: IO.IO<IResult> = () => {
  const uaParser = new UAParser();

  return uaParser.getResult();
};

// ref. https://github.com/faisalman/ua-parser-js/issues/182
export const isDesktop = (ua: IResult): boolean =>
  typeof ua.device.type === 'undefined';
