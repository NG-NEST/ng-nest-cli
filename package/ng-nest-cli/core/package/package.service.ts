import { Injectable } from '@angular/core';
import { XPackage } from './package';

@Injectable({
  providedIn: 'root'
})
export class XPackageService {
  packages: XPackage[] = [];
  register(option: XPackage) {
    if (!this.packages.find((x) => x.name === option.name)) {
      this.packages.push(option);
    }
    return true;
  }
}
