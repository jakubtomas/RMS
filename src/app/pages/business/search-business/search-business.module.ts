import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchBusinessPageRoutingModule } from './search-business-routing.module';

import { SearchBusinessPage } from './search-business.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SearchBusinessPageRoutingModule
  ],
  declarations: [SearchBusinessPage]
})
export class SearchBusinessPageModule {}
