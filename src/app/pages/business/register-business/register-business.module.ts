import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterBusinessPageRoutingModule } from './register-business-routing.module';

import { RegisterBusinessPage } from './register-business.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
      ReactiveFormsModule,
    IonicModule,
    RegisterBusinessPageRoutingModule
  ],
  declarations: [RegisterBusinessPage]
})
export class RegisterBusinessPageModule {}
