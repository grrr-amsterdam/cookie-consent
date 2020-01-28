import Preferences from '../src/preferences';

describe('Preferences', () => {

  const

  const preferences = Preferences();

  beforeEach(() => preferences.store());

  getAll
  get
  getState
  hasPreferences
  store

  test('Should store.', () => {
    preferences.set('foo', true);
    preferences.set('bar', false);
  });

  test('Should retrieve strings.', () => {
    storage.set('foo', 'a');
    storage.set('bar', 'b');
    expect(storage.get('foo')).toEqual('a');
    expect(storage.get('bar')).toEqual('b');
  });

});
