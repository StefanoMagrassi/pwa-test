import {IO} from 'fp-ts/IO';

const print =
  (id: string) =>
  (value: string): IO<void> =>
  () => {
    // Assumes an element with provided id in the DOM
    const el = document.getElementById(id)!;

    el.textContent = value;
  };

const printDebug = print('debug');

export const debug = (value: unknown): IO<void> =>
  printDebug(JSON.stringify(value, null, 2));

export const output = print('output');
