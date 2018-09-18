import _ from 'lodash';

import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Nav, Platform, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { User } from '../providers/providers';

import { LoginPage, EmployeeLoginPage } from '../pages/pages';
import { LoginModel } from '../models/models';
import { Constants } from './app.constants';

@Component({
  template: `<ion-menu persistent="true" [swipeEnabled]="false" [content]="content">
    <ion-content id="menu-content">
      <ion-list>
        <ion-item color="menu" no-padding menuClose>
            <ion-icon name="ios-close" float-right padding-vertical padding-right margin-right></ion-icon>
        </ion-item>
        <ion-item color="menu" *ngFor="let p of pages" (click)="openPage(p)" no-padding>
          <ion-label menuClose id="menu-label" padding-vertical>
            {{p.title}}
          </ion-label>
        </ion-item>
      </ion-list>
    <!--<div text-center>
      <a href="tel:{{dispatchNumber}}">
        <button menuClose ion-button outline color="white">
          <ion-icon id="call-dispatch" padding name="call"></ion-icon> CALL DISPATCH
        </button>
      </a>
    </div>-->
    </ion-content>
  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = Constants.INSTANCE_TYPE == Constants.INTERNAL_INSTANCE ? EmployeeLoginPage : LoginPage;

  @ViewChild(Nav) nav: Nav;

  dispatchNumber: string = '';

  pages: any[] = [];

  commonPages: any[] = [
    { title: 'Orders', component: 'UnderConstructionPage' },
    { title: 'Truck Map', component: 'UnderConstructionPage' },
    { title: 'Mixes', component: 'UnderConstructionPage' },
    { title: 'My Profile', component: 'UnderConstructionPage' }
  ];

  internalPages: any[] = [{ title: 'Markets',    component: 'MarketsPage' },
                          { title: 'Chats', component: 'UnderConstructionPage' },  
                        ];
  externalPages: any[] = [{ title: 'Account Summary', component: 'UnderConstructionPage' }];
  logoutPage   : any[] = [{ title: 'Log Out', component: 'LoginPage' }]

  internalSettingPages   : any[] = [{ title: 'Upload Image', component: 'WmcCustomerLogoPage' }]


  constructor(public platform: Platform,
              public storage: Storage,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              public events: Events,
              public user: User) {

    this.pages = this.logoutPage;

    this.platform.ready().then(() => {
      if(!this.platform.is('cordova') && this.rootPage == EmployeeLoginPage ) {
        this.rootPage = LoginPage;
      }
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      events.subscribe('user:login', (user: LoginModel) => this.setPages(user));
      events.subscribe('user:changed-user', (user: LoginModel) => this.setPages(user));
      events.subscribe('before:wmc_customer_select', (data) => this.hidePages());

      this.handleScreenLoad();
    });

  }

  handleScreenLoad() {
    this.storage.get('user').then((user: LoginModel) => {
      this.setPages(user);
      this.user.refreshUser().take(1).subscribe(() => {}, () => {});
      this.dispatchNumber = user && user.dispatch_number;
    }).catch();
  }

  setPages(user: LoginModel) {
    let internalPages = _.concat(this.internalPages, this.commonPages, this.internalSettingPages, this.logoutPage);
    let externalPages = [];
    
    //Hide and Show Account Summary Page based on user modal auth value
    if( user && ( !user.auth || user.auth.toLowerCase() == 'dispatch')) {
      externalPages = _.concat(this.commonPages, this.logoutPage);
    } else {
      externalPages = _.concat(this.commonPages, this.externalPages, this.logoutPage);
    }
    
    this.pages = user && user.internal ? internalPages : externalPages;
  }

  hidePages() {
    
    let pagesClone = _.cloneDeep(this.pages);
    _.remove(pagesClone, function(page) {
        return page.component == "OrdersPage" || page.component == "MapPage" || 
               page.component == "MixesPage" || page.component == "MyProfilePage" || 
               page.component == "ChatsPage" ||  page.component == "WmcCustomerLogoPage";
     });
   this.pages =  pagesClone;
  }  

  openPage(page) {
    if (page.component === 'LoginPage') {
      let loginPage:string = (this.platform.is('cordova') && Constants.INSTANCE_TYPE == Constants.INTERNAL_INSTANCE) ? EmployeeLoginPage : LoginPage;
      this.user.logout();
      this.nav.setRoot(loginPage); 
      return; 
    }

    if (page.component === 'AccountSummaryPage' || page.component === 'MyProfilePage') {
      this.nav.push(page.component);
    } else if (page.component === 'MapPage') {
      this.nav.setRoot(page.component,{'isRootPage': true} );
    }
     else {
      this.nav.setRoot(page.component);
    }
  }

}
