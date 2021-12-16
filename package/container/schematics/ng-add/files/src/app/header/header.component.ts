import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { XSliderNode } from '@ng-nest/ui/slider';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  data: XSliderNode[] = [];

  constructor(private httpClient: HttpClient, private location: Location) {}

  ngOnInit() {
    this.getPlugins();
  }

  getPlugins() {
    this.httpClient.get<XSliderNode[]>('/v1/plugins').subscribe((x) => {
      this.data = x;
      if (x && x.length > 0) {
        this.nodeChange(x[0]);
      }
    });
  }

  nodeChange(node: XSliderNode) {
    this.location.go(`./${node.id}`);
  }
}
