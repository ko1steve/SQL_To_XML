import { expect } from 'chai';
import { StringBuilder } from '../../src/data/stringBuilder';

describe('StringBuilder', () => {
  const stringBuilder = new StringBuilder()

  it('append()', () => {
    stringBuilder.append('1')
    stringBuilder.append('2')
  });

  it('strings', () => {
    expect(stringBuilder.strings[0]).equal('1');
    expect(stringBuilder.strings[1]).equal('2');
  });

  it('size', () => {
    expect(stringBuilder.size).equal(2);
  });

  it('toString()', () => {
    expect(stringBuilder.toString()).equal('12');
    expect(stringBuilder.toString(' ')).equal('1 2');
    expect(stringBuilder.toString(',')).equal('1,2');
  });
});