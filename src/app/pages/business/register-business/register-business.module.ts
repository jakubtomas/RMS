import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterBusinessPageRoutingModule } from './register-business-routing.module';

import { RegisterBusinessPage } from './register-business.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterBusinessPageRoutingModule
  ],
  declarations: [RegisterBusinessPage]
})
export class RegisterBusinessPageModule {}
