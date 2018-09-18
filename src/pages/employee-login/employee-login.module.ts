import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeLoginPage } from './employee-login';

@NgModule({
  declarations: [
    EmployeeLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeLoginPage),
  ],
})
export class EmployeeLoginPageModule {}
