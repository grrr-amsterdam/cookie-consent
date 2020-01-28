import Storage from '../src/storage';

describe('Tabs', () => {

  beforeEach(() => {
  });

  const storage = Storage();

  test('Should store and retrieve booleans.', () => {
    storage.set('foo', true);
    storage.set('bar', false);

    expect(storage.has('foo')).toEqual(true);
    expect(storage.has('bar')).toEqual(true);

    expect(storage.get('foo')).toEqual('true');
    expect(storage.get('bar')).toEqual('false');
  });

  test('Should store and retrieve strings.', () => {
    storage.set('foo', 'a');
    storage.set('bar', 'b');
    expect(storage.get('foo')).toEqual('a');
    expect(storage.get('bar')).toEqual('b');
  });

});
