/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-useless-concat */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
// eslint-disable-next-line no-unused-vars
function handleSubmit(allowAll, thisPlugin) {
  setCheckBox(allowAll, 'tracking-cookies')
    .then(() => {
      handleAcceptance(allowAll, 1, 'tracking-cookies') // 1 = marketing type, 2 = others for future
        // .then(() => handleAcceptance(thisPlugin, 2, 'extra-tracking-cookies'))
        .then(() => {
          closeModal(thisPlugin);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  );  
}
function setCheckBox(allowAll, elementId) {  
    if (allowAll) {
      document.getElementById(elementId).checked = true;
    }
    return new Promise(resolve => {
      // only to show the checkbox is really set before closing the dialog
      setTimeout(() => {
        resolve();
    }, 200);
  });
}
function handleAcceptance(allowAll, type, elementId) {
  return new Promise(((resolve) => {
    let request;
    const trackingCookiesAccepted = allowAll || document.getElementById(elementId).checked;
    setCookie(''.concat(consentCookieName, '_').concat(type), trackingCookiesAccepted, consentCookieExpireDays);
    setCookie(''.concat(consentCookieName, '_').concat('version'), consentCookieVersion, consentCookieExpireDays);
    
    const isMarketingCookie = type === 1; 
    const trackAllowedName = isMarketingCookie ? marketingTrackAllowedName : otherTrackAllowedName;

    if (trackingCookiesAccepted === true) {
      request = handleAccept(trackAllowedName);
    } else {
      request = isMarketingCookie ? handleDeclineMarketing(trackAllowedName) : handleDeclineOthers();
    }
    request
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error(error);
      });
  }));
}
function setCookie(name, value, days, mins) {
  let expires = '';
  if (days || mins) {
    const date = new Date();
    date.setTime(date.getTime() + ((days || 0) * 24 * 60 * 60 * 1000) + (mins || 0) * 60 * 1000);
    expires = '; expires='.concat(date.toUTCString());
  }
  document.cookie = `${name}=${value}${expires}; path=/; domain=${window.domain}; Secure`;
}
function removeCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.domain}; path=/;`;
}
function handleAccept(trackAllowedName) {  return new Promise(((resolve) => {
    window[trackAllowedName] = true;
    resolve();
  }));
}

function handleDeclineMarketing(trackAllowedName) {
  return new Promise(((resolve) => {
    removeAllMarketingCookies();
    window[`ga-disable-${googleAnalyticsId}`] = true;
    window[trackAllowedName] = false;
    resolve();
  }));
}
function handleDeclineOthers() {
  return new Promise(((resolve) => {
    removeAllOtherTracking();
    resolve();
  }));
}
function removeAllMarketingCookies() {
  // Please add your code here to stop tracking
}
function removeAllOtherTracking() {
  // Please add your code here to stop tracking
}
function openModal() {
  let modal = document.getElementById('cookie-modal');
  modal.classList.remove('hide');
  modal.classList.add('in');
  modal.setAttribute('style', 'display: block;');
  modal = document.getElementsByClassName('modal-backdrop')[0];
  modal.classList.remove('hide');
  modal.classList.add('in');
}

function closeModal(thisPlugin) {
  let modal = document.getElementById(thisPlugin);
  modal.classList.remove('in');
  modal.classList.add('hide');
  modal.setAttribute('style', 'display: none;');
  modal = document.getElementsByClassName('modal-backdrop')[0];
  modal.classList.remove('in');
  modal.classList.add('hide');
}

// eslint-disable-next-line no-unused-vars
function openPrivacyModal() {
  const modal = document.getElementById('cookie-modal');
  modal.classList.remove('hide');
  modal.classList.add('in');
  modal.setAttribute('style', 'display: none;');
  const prModal = document.getElementById('privacyCenter-modal');
  prModal.setAttribute('style', 'display: block;');
}

document.addEventListener('DOMContentLoaded', () => {
  // the event occurred
  // eslint-disable-next-line no-undef
  if (shouldOpenModal) {
    openModal();
  }
  setCookie('eloquaReferrerUrl', window.location.hostname, null, 15);
});
