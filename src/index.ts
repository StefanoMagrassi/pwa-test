import * as Auth0 from '@auth0/auth0-spa-js';

declare global {
  interface Window {
    auth0: typeof Auth0;
  }
}

console.log('PD!');
window.auth0
  .createAuth0Client({
    domain: 'dev-shh2c83evzardpju.us.auth0.com',
    clientId: 'cU6Ildb9wjME4v79YJPYMSWsB72iVbLZ',
    authorizationParams: {
      redirect_uri: window.location.href
    }
  })
  .then(async auth0Client => {
    console.log(auth0Client);

    // Assumes a button with id "login" in the DOM
    document.getElementById('login')!.addEventListener('click', e => {
      e.preventDefault();

      void auth0Client.loginWithRedirect();
    });

    if (
      location.search.includes('state=') &&
      (location.search.includes('code=') || location.search.includes('error='))
    ) {
      await auth0Client.handleRedirectCallback();

      window.history.replaceState({}, document.title, '/');
    }

    // Assumes a button with id "logout" in the DOM
    document.getElementById('logout')!.addEventListener('click', e => {
      e.preventDefault();

      void auth0Client.logout();
    });

    const isAuthenticated = await auth0Client.isAuthenticated();
    const userProfile = await auth0Client.getUser();

    // Assumes an element with id "profile" in the DOM
    const profileElement = document.getElementById(
      'user-profile'
    ) as HTMLTextAreaElement;

    profileElement.value = isAuthenticated
      ? JSON.stringify(userProfile, null, 2)
      : '';
  })
  .catch(console.error);
