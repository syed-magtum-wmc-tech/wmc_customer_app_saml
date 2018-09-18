import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WmcCustomersPage } from './wmc-customers';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WmcCustomersPage,
  ],
  imports: [
    IonicPageModule.forChild(WmcCustomersPage),
    ComponentsModule
  ],
})
export class WmcCustomersPageModule {}
