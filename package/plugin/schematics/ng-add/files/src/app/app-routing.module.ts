import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'overview',
    loadChildren: () => import('./pages/overview/overview.module').then((x) => x.OverviewModule)
  },
  {
    path: 'menu-one',
    loadChildren: () => import('./pages/menu-one/menu-one.module').then((x) => x.MenuOneModule)
  },
  {
    path: 'menu-two',
    loadChildren: () => import('./pages/menu-two/menu-two.module').then((x) => x.MenuTwoModule)
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
