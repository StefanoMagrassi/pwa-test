import * as T from 'fp-ts/Task';
import {pipe} from 'fp-ts/function';
import {runAuth0} from './auth0';
import {detect} from './ua';

// --- Run
pipe(
  runAuth0,
  T.chainIOK(() => detect)
)().catch(console.error);
