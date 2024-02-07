import * as IO from 'fp-ts/IO';
import * as T from 'fp-ts/Task';
import {pipe} from 'fp-ts/function';
import {installed} from './installed';
import {debug, output} from './print';
import {detect, isDesktop} from './ua';

const main = pipe(
  detect,
  IO.chainFirst(data =>
    output(isDesktop(data) ? 'IS DESKTOP' : 'IS MOBILE (not desktop)')
  ),
  IO.flatMap(debug),
  T.fromIO,
  T.flatMap(() => installed)
);

// --- Run
main().catch(console.error);
