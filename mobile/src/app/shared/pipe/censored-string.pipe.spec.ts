import { CensoredStringPipe } from './censored-string.pipe';

describe('CensoredStringPipe', () => {
  it('create an instance', () => {
    const pipe = new CensoredStringPipe();
    expect(pipe).toBeTruthy();
  });
});
