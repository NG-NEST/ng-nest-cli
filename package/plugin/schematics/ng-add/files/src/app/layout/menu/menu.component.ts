import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { XMenuNode } from '@ng-nest/ui/menu';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  constructor(
    public layout: LayoutService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.layout.setActivated(this.location.path());
  }

  menuClick(menu: XMenuNode) {
    if (!menu.leaf) {
      this.router.navigate([`./${menu.id}`], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
