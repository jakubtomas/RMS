import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListBusinessPageRoutingModule } from './list-business-routing.module';

import { ListBusinessPage } from './list-business.page';
import {OrderBusinessesPipe} from "../../../pipes/order-businesses.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListBusinessPageRoutingModule
  ],
  declarations: [ListBusinessPage,OrderBusinessesPipe]
})
export class ListBusinessPageModule {}
