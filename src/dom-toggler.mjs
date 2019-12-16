const SCRIPT_ATTRIBUTE = 'data-cookie-consent';
const ACCEPTED_STATE_ATTRIBUTE = 'data-cookie-consent-accepted';
const REJECTED_STATE_ATTRIBUTE = 'data-cookie-consent-rejected';

/**
 * DOM toggler, which enables conditional script tags or embedded content.
 */
const DomToggler = () => {

  /**
   * Append a single script.
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
    const scripts = document.documentElement.querySelectorAll(`script[${SCRIPT_ATTRIBUTE}="${id}"]`);
    [...scripts].forEach(script => {
      appendScript(script);
      script.parentNode.removeChild(script);
    });
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
   * Enable script tags by removing bogus type.
   */
  const toggleConditionalContent = ({ id, accepted }) => {
    const accepts = document.body.querySelectorAll(`[${ACCEPTED_STATE_ATTRIBUTE}="${id}"]`);
    const rejects = document.body.querySelectorAll(`[${REJECTED_STATE_ATTRIBUTE}="${id}"]`);
    [...accepts].forEach(el => accepted ? showElement(el) : hideElement(el));
    [...rejects].forEach(el => accepted ? hideElement(el) : showElement(el));
  };

  return {
    toggle: preferences => {
      preferences.forEach(type => {
        toggleScripts(type);
        toggleConditionalContent(type);
      });
    },
  };

};

export default DomToggler;
