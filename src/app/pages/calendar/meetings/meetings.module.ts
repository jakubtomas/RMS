import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingsPageRoutingModule } from './meetings-routing.module';

import { MeetingsPage } from './meetings.page';
import {SharedModule} from "../../../shared/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeetingsPageRoutingModule,
    SharedModule
  ],
  declarations: [MeetingsPage]
})
export class MeetingsPageModule {}
