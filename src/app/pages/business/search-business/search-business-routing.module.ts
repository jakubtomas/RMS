import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchBusinessPage } from './search-business.page';

const routes: Routes = [
  {
    path: '',
    component: SearchBusinessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchBusinessPageRoutingModule {}
