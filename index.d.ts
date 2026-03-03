/**
 * TypeScript type definitions for @grrr/cookie-consent
 */

export interface CookieConsentConfig {
  prefix?: string;
  append?: boolean;
  appendDelay?: number;
  acceptAllButton?: boolean;
  type?: 'dialog' | 'checkbox';
  labels?: {
    title?: string;
    description?: string;
    button?: {
      default?: string;
      acceptAll?: string;
    };
    aria?: {
      button?: string;
      tabList?: string;
      tabToggle?: string;
    };
  };
  dialogTemplate?: string;
}

export interface Cookie {
  id: string;
  title: string;
  description?: string;
  checked?: boolean;
  required?: boolean;
  readonly?: boolean;
}

export interface CookiePreference {
  id: string;
  accepted: boolean;
}

export type CookieConsentEventType = 'submit' | 'update';

export type CookieConsentEventHandler = (preferences: CookiePreference[]) => void;

/**
 * CookieConsent Web Component
 * A custom element for managing cookie consent with accessible dialog,
 * agnostic tag triggers and conditional content, script and embed hooks.
 */
export default class CookieConsent extends HTMLElement {
  /**
   * The cookies configuration from the data-cookies attribute
   */
  cookies: Cookie[];

  /**
   * The configuration object
   */
  config: {
    type: 'dialog' | 'checkbox';
    prefix: string;
    dialogTemplate: string;
  };

  /**
   * Event dispatcher for handling submit and update events
   */
  events: {
    add: (type: CookieConsentEventType, handler: CookieConsentEventHandler) => void;
    dispatch: (type: CookieConsentEventType, data?: unknown) => void;
  };

  /**
   * Show the cookie consent dialog
   */
  show: () => void;

  /**
   * Hide the cookie consent dialog
   */
  hide: () => void;

  /**
   * Register an event handler
   * @param type - The event type ('submit' or 'update')
   * @param handler - The event handler function
   */
  on(type: CookieConsentEventType, handler: CookieConsentEventHandler): void;

  /**
   * Observed attributes
   */
  static readonly observedAttributes: readonly ['data-cookies'];
}

export { CookieConsent as default };
