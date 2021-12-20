import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { XMenuNode } from '@ng-nest/ui/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menus: XMenuNode[] = [
    { id: 'overview', label: '项目总览', icon: 'fto-box' },
    { id: 'project-list', label: '项目列表', icon: 'fto-list' },
    { id: 'contract', label: '项目合同', icon: 'fto-file-text' },
    { id: 'report', label: '项目报表', icon: 'fto-activity' },
    {
      id: 'progress',
      pid: 'report',
      label: '实时进度',
      icon: 'fto-git-commit',
    },
    {
      id: 'collection',
      pid: 'report',
      label: '项目回款',
      icon: 'fto-dollar-sign',
    },
  ];

  activatedId = '';

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    const pathSpt = this.location.path().split('/');
    const activatedMenu = this.menus.find(
      (x) => pathSpt[pathSpt.length - 1] === x.id
    );
    if (activatedMenu) {
      this.activatedId = activatedMenu.id;
    }
  }

  menuClick(menu: XMenuNode) {
    !menu.leaf && this.router.navigate([`${menu.id}`]);
  }
}
