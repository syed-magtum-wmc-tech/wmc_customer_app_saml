import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Events, Platform, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { User } from '../../providers/providers';
import { MarketsPage, OrdersPage, WmcCustomersPage, LoginPage } from '../pages';
import { LoginModel, AccountModel } from '../../models/models';
import _ from 'lodash';
import { Constants } from '../../app/app.constants';


/**
 * Generated class for the EmployeeLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-employee-login',
  templateUrl: 'employee-login.html',
})
export class EmployeeLoginPage {

  account: AccountModel = new AccountModel();
  
  rememberMe:boolean  = false;
  isApp:boolean = false;
  loader:any;
  browser:any;
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
  }            

  ionViewDidLoad() {
    let changedProfile: boolean = this.navParams.get('changedProfile');

    this.storage.get('user').then((user: LoginModel) => user && (user.rememberMe || changedProfile) && this.navigate([user])).catch();
  }

  
  doSAMLLogin(param:any) {
    let loginParam = {...param};
    loginParam.rememberMe = this.account.rememberMe;
    
    this.user
      .saml_login(loginParam)
      .subscribe(
        (models: LoginModel[]) => { 
          this.navigate(models);                           
          this.closeEmployeeLogin();
          
         },
         err  => {this.showToast('Invalid Username or Password');
                  this.closeEmployeeLogin();
         }
    );
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

  
  //Employee Login
  doEmployeeLogin(){
   
   if(!this.browser ){
    let target = "_blank";
   let options = "location=no,clearcache=yes,hideurlbar=yes,toolbar=yes,hidden=no";

    this.browser = this.iab.create(Constants.API_HOST +'/saml/sso?mode=mobile', target, options);

    this.browser.on('loadstart').subscribe(event => {
      let message:string = '' 
      message += event.url && ' URL ='+event.url;
      message += event.code && ' code ='+event.code;
      message += event.message && ' URL ='+event.message;

      
      if(event.url.substr('/saml/mobile_login_status') != -1 )
      {
        let url = decodeURIComponent(event.url)
        let urlparam:any = _.chain(url).split('?').nth(1).split('&').map(_.partial(_.split, _, '=', 2)).fromPairs().value();
        if(urlparam.status){

           if(urlparam.status.toLowerCase() == 'success'){
              this.doSAMLLogin(urlparam);
           } else if(urlparam.status.toLowerCase() != 'success') {
              let error:string = urlparam.error_code || 'Error in sso login'  
              this.showToast(error);
              this.closeEmployeeLogin();
           }
        }
      }
      console.log(event);
    });

    this.browser.on('loadstop').subscribe(event => {
        if (this.browser != undefined) {
            this.browser.show();
        }
    });

    this.browser.on('loaderror').subscribe(event => {
      console.log(event);
    });
   }
  }

  closeEmployeeLogin() {
    setTimeout(()=> { this.browser.close();   this.browser = undefined; }, 2000); 
  }

  showCustomerLogin() {
    this.navCtrl.setRoot(LoginPage )
  }

}
