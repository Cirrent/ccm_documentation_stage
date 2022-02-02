/* eslint-disable no-useless-concat */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */

function processCookie(type, trackAllowedName) {
  
  const consentCookieNameString = `${consentCookieName}_${type}`;
  const consentCookieVersionString = `${consentCookieName}_version`;

  if (navigator.doNotTrack !== '1' && !consentCookiesExists(type)) {
    // show the cookie dialog
    shouldOpenModal = true;
  } 
  else if (consentCookiesExists(type)) {
    const cookiesAlreadyConfirmedMatch = getCookieSplits(consentCookieNameString);
    const cookiesVersionMatch = getCookieSplits(consentCookieVersionString);

    if (cookiesVersionMatch) {
      const cookiesVersion = cookiesVersionMatch[2].toString();
      if (cookiesVersion !== consentCookieVersion) {
          shouldOpenModal = true;
          return;
      }
	
	  if (cookiesAlreadyConfirmedMatch) {
		cookiesAlreadyConfirmed = cookiesAlreadyConfirmedMatch[2] === 'true';
		window[trackAllowedName] = cookiesAlreadyConfirmed;
		if (!cookiesAlreadyConfirmed)
			removeTracking(type, trackAllowedName);
	  }
	}
    // leave tracking enabled and don't open cookie modal dialog
  } 
  else {
    if (navigator.doNotTrack === '1') {
      // we need to set cookie_consent cookie to false immediately to prevent GTM to init GoogleAnalytics tracking.
      // based on vi.helpers.setCookie, but vi.helpers is not available yet
      setCookie(consentCookieNameString, 'false', consentCookieExpireDays);
      setCookie(consentCookieVersionString, consentCookieVersion, consentCookieExpireDays);
    }
	  removeTracking(type, trackAllowedName);
  }
}

function getCookieSplits(cookieName){
  return document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
}

function consentCookiesExists(type) {
  return navigator.cookieEnabled 
    && cookieExists(`${consentCookieName}_${type}`)
    && cookieExists(`${consentCookieName}_version`);
}

function cookieExists(cookieName) {
  return document.cookie.indexOf(cookieName) !== -1;
}

function removeTracking(type, trackAllowedName) {	
    // remove all marketing cookies and disable GA tracking
  const isMarketingCookie = type === 1;
  if (isMarketingCookie) {
    window[`ga-disable-${googleAnalyticsId}`] = true;
    window[trackAllowedName] = false;	
    removeAllMarketingCookies();
  } else removeAllOtherTracking();
}