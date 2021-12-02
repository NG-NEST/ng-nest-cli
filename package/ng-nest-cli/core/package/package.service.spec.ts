import { XPackageService } from './package.service';

describe('package', () => {
  let service: XPackageService;
  beforeEach(() => {
    service = new XPackageService();
  });

  it('#getValue should return real value', () => {
    expect(service.register({ name: '123456' })).toBe(true);
  });
});
