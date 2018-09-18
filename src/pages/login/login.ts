import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Events, Platform, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { User } from '../../providers/providers';
import { MarketsPage, OrdersPage, WmcCustomersPage, EmployeeLoginPage } from '../pages';
import { LoginModel, AccountModel } from '../../models/models';
import { Constants } from '../../app/app.constants';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  account: AccountModel = new AccountModel();
  
  rememberMe:boolean  = false;
  isApp:boolean = false;
  loader:any;
  browser:any;
  showBackButton:boolean = false;
  constructor(public navCtrl: NavController,
              public iab:InAppBrowser,
              public alertCtrl: AlertController,
              public loadingCtrl:LoadingController,
              public toastCtrl: ToastController,
              public navParams: NavParams,
              public events: Events,
              public storage: Storage,
              public user: User,
              public platform:Platform
            ) { }

  ngOnInit() {
    this.isApp = this.platform.is('cordova');
    this.showBackButton = this.isApp && (Constants.INSTANCE_TYPE == Constants.INTERNAL_INSTANCE);
  }            
  
  
  ionViewDidLoad() {
    let changedProfile: boolean = this.navParams.get('changedProfile');

    this.storage.get('user').then((user: LoginModel) => user && (user.rememberMe || changedProfile) && this.navigate([user])).catch();
  }

  doLogin() {
    this.user
      .login(this.account)
      .subscribe(
        (models: LoginModel[]) => this.navigate(models),
        err  => this.showToast('Invalid Username or Password'));
  }
  
  navigate(users: LoginModel[]) {

    if(users.length == 1){
      
      this.events.publish('user:login', users[0]);
      this.storage.set('user', users[0]);
      this.user._user = users[0];
      if (users[0].internal) {
        this.navCtrl.setRoot(MarketsPage);
      } else {
        this.navCtrl.setRoot(OrdersPage);
      }
    } else {
      // To list out all menu, based on user type (internal or external)
      this.events.publish('user:login', users[0]);
      this.user._user = null;
      this.navCtrl.setRoot(WmcCustomersPage);
    }
  }

  showAlertMsg(title:string, subTitle:string = ''){

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();

  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom'
    });

    toast.present();
  }

  forgotPassword() {
    this.showAlert();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      mode: 'ios',
      title: `Forgot Password?`,
      subTitle: `Please enter your e-mail to receive a link to reset your password`,
      inputs: [{
        name: 'email',
        type: 'email',
        placeholder: 'E-mail'
      }],
      buttons: [{
        text: `Cancel`,
      }, {
        text: `Send`,
        handler: data => this.handleEmail(data.email)
      }]
    });

    alert.present();
  }

  handleEmail(email: string) {
    if (email) {
      this.user
        .forgotPassword(email).take(1)
        .subscribe(
          model => this.showToast(`Sent Reset Password link to ${email}`),
          err => this.showToast(`Failed to send Reset Password link to ${email}`)
        )
    } else {
      this.showToast('Please enter an E-mail Address');
      return false;
    }
  }

  showEmployeeLogin() {
    this.navCtrl.setRoot(EmployeeLoginPage);
  }

}
