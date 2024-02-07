import * as T from 'fp-ts/Task';
import {pipe} from 'fp-ts/function';
import {installedRelatedApps, isInstalled} from './installed';
import {debug, output} from './print';
import {detect, isDesktop} from './ua';

const main = pipe(
  T.Do,
  T.apS('ua', T.fromIO(detect)),
  T.apS('relatedApps', installedRelatedApps),
  T.apS('isInstalled', T.fromIO(isInstalled)),
  T.chainFirstIOK(a =>
    output(isDesktop(a.ua) ? 'IS DESKTOP' : 'IS MOBILE (not desktop)')
  ),
  T.flatMapIO(debug)
);

// --- Run
main().catch(console.error);
