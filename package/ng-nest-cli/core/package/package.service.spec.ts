import { MfePackageService } from './package.service';

describe('package', () => {
  let service: MfePackageService;
  beforeEach(() => {
    service = new MfePackageService();
  });

  it('#getValue should return real value', () => {
    expect(service.register({ name: '123456' })).toBe(true);
  });
});
