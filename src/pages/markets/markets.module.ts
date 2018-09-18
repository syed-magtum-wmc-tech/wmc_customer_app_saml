import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MarketsPage } from './markets';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MarketsPage,
  ],
  imports: [
    IonicPageModule.forChild(MarketsPage),
    ComponentsModule
  ],
  exports: [
    MarketsPage
  ]
})
export class MarketsPageModule { }
