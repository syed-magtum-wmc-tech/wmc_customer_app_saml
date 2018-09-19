
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-markets',
  templateUrl: 'markets.html'
})
export class MarketsPage implements OnInit {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
  ngOnInit(){

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnderConstructionPage');
  }

  navigatePage(page:string) {
    
    this.navCtrl.push(page)

  }
}
