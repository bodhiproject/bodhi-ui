import AddressBalance from './AddressBalance';
import { decimalToSatoshi } from '../../helpers/utility';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
const navigatorMock = {};
global.navigator = navigatorMock;
global.localStorage = localStorageMock;

describe('stores/models/AddressBalance', () => {
  let ab;
  beforeEach(() => ab = null);
  it('Constructor input Satoshi', () => {
    const input = {
      address: '123456',
      qtum: decimalToSatoshi(new Number(10)), // eslint-disable-line
      bot: decimalToSatoshi('2000'),
    };
    ab = new AddressBalance(input);

    expect(ab.address).toBe(input.address);
    expect(ab.qtum).toBe(10);
    expect(ab.bot).toBe(2000);
  });

  it('Constructor input floating', () => {
    const input = {
      address: '123456',
      qtum: decimalToSatoshi(new Number(10.5)), // eslint-disable-line
      bot: decimalToSatoshi('2000.5'),
    };
    ab = new AddressBalance(input);

    expect(ab.address).toBe(input.address);
    expect(ab.qtum).toBe(10.5);
    expect(ab.bot).toBe(2000.5);
  });

  it('Constructor input NAN', () => {
    const input = {
      address: '123456',
      qtum: decimalToSatoshi(new Number('aa')), // eslint-disable-line
      bot: 'bb',
    };
    ab = new AddressBalance(input);

    expect(ab.address).toBe(input.address);
    expect(ab.qtum).toBe(NaN);
    expect(ab.bot).not.toBe(NaN);
  });
});
