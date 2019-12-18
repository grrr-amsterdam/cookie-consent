const GENERAL_ATTRIBUTE = 'data-cookie-consent';
const ACCEPTED_STATE_ATTRIBUTE = 'data-cookie-consent-accepted';
const REJECTED_STATE_ATTRIBUTE = 'data-cookie-consent-rejected';

/**
 * DOM toggler, which enables conditional script tags or embedded content.
 */
const DomToggler = config => {

  /**
   * Append a single script.
   * @TODO append it to the same location and re-add classes and attributes.
   */
  const appendScript = script => {
    const newScript = document.createElement('script');
    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.innerHTML = script.innerHTML;
    }
    document.head.appendChild(newScript);
  };

  /**
   * Enable script tags.
   * Note: scripts are not removed for the current view when preferences are updated.
   */
  const toggleScripts = ({ id, accepted }) => {
    if (!accepted) {
      return;
    }
    const scripts = document.documentElement.querySelectorAll(`script[${GENERAL_ATTRIBUTE}="${id}"]`);
    [...scripts].forEach(script => {
      appendScript(script);
      script.parentNode.removeChild(script);
    });
  };

  /**
   * Show a single iframe.
   */
  const showIframe = iframe => {
    const src = iframe.getAttribute('data-src');
    if (src) {
      iframe.setAttribute('src', src);
      iframe.removeAttribute('data-src');
    }
  };

  /**
   * Hide a single iframe.
   */
  const hideIframe = iframe => {
    const src = iframe.getAttribute('src');
    if (src) {
      iframe.setAttribute('data-src', src);
      iframe.removeAttribute('src');
    }
  };

  /**
   * Show conditional iframes based on wanted state.
   */
  const toggleConditionalIframes = ({ id, accepted }) => {
    const iframes = document.body.querySelectorAll(`iframe[${GENERAL_ATTRIBUTE}="${id}"]`);
    [...iframes].forEach(el => accepted ? showIframe(el) : hideIframe(el));
  };

  /**
   * Show a single element.
   */
  const showElement = el => {
    el.style.display = '';
    el.removeAttribute('aria-hidden');
    el.removeAttribute('hidden');
  };

  /**
   * Hide a single element.
   */
  const hideElement = el => {
    el.style.display = 'none';
    el.setAttribute('aria-hidden', 'true');
  };

  /**
   * Show conditional elements based on wanted state.
   */
  const toggleConditionalElements = ({ id, accepted }) => {
    const accepts = document.body.querySelectorAll(`[${ACCEPTED_STATE_ATTRIBUTE}="${id}"]`);
    const rejects = document.body.querySelectorAll(`[${REJECTED_STATE_ATTRIBUTE}="${id}"]`);
    [...accepts].forEach(el => accepted ? showElement(el) : hideElement(el));
    [...rejects].forEach(el => accepted ? hideElement(el) : showElement(el));
  };

  return {
    toggle: preferences => {
      const cookies = config.get('cookies') || [];
      cookies.forEach(type => {
        const accepted = preferences.getState(type.id);
        toggleScripts({ id: type.id, accepted });
        toggleConditionalElements({ id: type.id, accepted });
        toggleConditionalIframes({ id: type.id, accepted });
      });
    },
  };

};

export default DomToggler;
