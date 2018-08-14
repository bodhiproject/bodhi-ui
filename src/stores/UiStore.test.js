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
  it('change locale', () => {
    const store = new UiStore();
    store.changeLocale('ko-KR');
    expect(store.locale).toBe('ko-KR');
  });
});
