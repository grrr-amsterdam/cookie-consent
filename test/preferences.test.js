import Preferences from '../src/preferences';

describe('Preferences', () => {

  const FOO = { id: 'foo', accepted: true };
  const BAR = { id: 'bar', accepted: false };
  const COOKIES = [FOO, BAR];

  const preferences = Preferences();

  beforeEach(() => preferences.store([]));

  test('get', () => {
    expect(preferences.get('foo')).toBeUndefined();
    preferences.store(COOKIES);
    expect(preferences.get('foo')).toEqual(FOO);
  });

  test('getAll', () => {
    expect(preferences.getAll()).toEqual([]);
    preferences.store(COOKIES);
    expect(preferences.getAll()).toEqual(COOKIES);
    expect(preferences.getAll().length).toEqual(2);
  });

  test('getState', () => {
    expect(preferences.getState('foo')).toBeUndefined();
    preferences.store(COOKIES);
    expect(preferences.getState('foo')).toEqual(true);
    expect(preferences.getState('bar')).toEqual(false);
  });

  test('hasPreferences', () => {
    expect(preferences.hasPreferences()).toBeFalsy();
    preferences.store(COOKIES);
    expect(preferences.hasPreferences()).toBeTruthy();
  });

  test('store', () => {
    preferences.store(COOKIES);
    expect(preferences.getAll()).toEqual(COOKIES);
    preferences.store([]);
    expect(preferences.getAll()).toEqual([]);
  });

});
