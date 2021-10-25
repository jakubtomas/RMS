import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailBusinessPageRoutingModule } from './detail-business-routing.module';

import { DetailBusinessPage } from './detail-business.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailBusinessPageRoutingModule
  ],
  declarations: [DetailBusinessPage]
})
export class DetailBusinessPageModule {}
