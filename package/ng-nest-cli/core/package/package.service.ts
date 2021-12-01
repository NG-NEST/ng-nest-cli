import { Injectable } from '@angular/core';
import { NgPackage } from './package';

@Injectable({
  providedIn: 'root',
})
export class NgPackageService {
  packages: NgPackage[] = [];
  register(option: NgPackage) {
    if (!this.packages.find((x) => x.name === option.name)) {
      this.packages.push(option);
    }
  }
}
