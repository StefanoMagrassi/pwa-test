import * as IO from 'fp-ts/IO';
import {UAParser, type IResult} from 'ua-parser-js';

export const detect: IO.IO<IResult> = () => {
  const uaParser = new UAParser();

  return uaParser.getResult();
};

export const isDesktop = (ua: IResult): boolean =>
  typeof ua.device.type === 'undefined';
