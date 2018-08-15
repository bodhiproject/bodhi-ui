import UiStore from '../../src/stores/UiStore';

// setup mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
const navigatorMock = {
  language: 'en-US',
};
global.navigator = navigatorMock;
global.localStorage = localStorageMock;

// start test
describe('UiStore', () => {
  let store;
  beforeEach(() => {
    store = new UiStore();
  });

  it('change locale', () => {
    store.changeLocale('ko-KR');
    expect(store.locale).toBe('ko-KR');
  });
});
