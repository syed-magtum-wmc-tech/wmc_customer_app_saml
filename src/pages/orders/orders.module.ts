import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { OrdersPage } from './orders';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    OrdersPage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(OrdersPage)
  ],
  exports: [
    OrdersPage
  ]
})
export class OrdersPageModule { }
