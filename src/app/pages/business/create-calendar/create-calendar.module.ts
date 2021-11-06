import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCalendarPageRoutingModule } from './create-calendar-routing.module';

import { CreateCalendarPage } from './create-calendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateCalendarPageRoutingModule
  ],
  declarations: [CreateCalendarPage]
})
export class CreateCalendarPageModule {}
