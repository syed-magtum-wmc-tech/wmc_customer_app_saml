import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnderConstructionPage } from './under-construction';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UnderConstructionPage,
  ],
  imports: [
    IonicPageModule.forChild(UnderConstructionPage),
    ComponentsModule
  ],
})
export class UnderConstructionPageModule {}
