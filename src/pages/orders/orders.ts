
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html'
})
export class OrdersPage implements OnInit, OnDestroy {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  ngOnInit(){

  }
  ngOnDestroy(){

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnderConstructionPage');
  }
}