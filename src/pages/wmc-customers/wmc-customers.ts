import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WmcCustomersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wmc-customers',
  templateUrl: 'wmc-customers.html',
})
export class WmcCustomersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  ngOnInit(){

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnderConstructionPage');
  }
}
