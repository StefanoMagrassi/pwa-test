import * as T from 'fp-ts/Task';

// non standard API - use it carefully
// ref. https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getInstalledRelatedApps

// ref. https://github.com/w3c/manifest/wiki/Platforms
type Platform =
  | 'chrome_web_store'
  | 'play'
  | 'chromeos_play'
  | 'webapp'
  | 'windows'
  | 'f-droid'
  | 'amazon';

interface InstalledRelatedApp {
  readonly id?: string;
  readonly platform: Platform;
  readonly url?: string;
  readonly version?: string;
}

interface NavigatorExt extends Navigator {
  getInstalledRelatedApps?(): Promise<InstalledRelatedApp[]>;
}

export const installed: T.Task<void> = () => {
  const nav = navigator as unknown as NavigatorExt;

  if (nav.getInstalledRelatedApps) {
    return nav.getInstalledRelatedApps().then(console.log);
  }

  return Promise.resolve();
};
