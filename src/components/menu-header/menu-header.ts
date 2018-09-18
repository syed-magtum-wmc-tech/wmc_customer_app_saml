import { Component, OnInit, Input } from '@angular/core';

import { NavController, ViewController } from 'ionic-angular';

import { WeatherProvider } from '../../providers/providers';
import { WeatherModel } from '../../models/models';

@Component({
  selector: 'menu-header',
  templateUrl: 'menu-header.html'
})
export class MenuHeader implements OnInit {

  weather: WeatherModel;

  @Input() hideWeather:boolean;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public weatherProvider: WeatherProvider) { }

  ngOnInit() {
    if(this.getActivePage() != "WmcCustomersPage") {

      this.getWeather();
    } else {
      this.weatherProvider.weather$ = null;    
    }

  }

  getActivePage(): string {
    return this.navCtrl.getActive().name;
  }
  
  getWeather() {
    this.weatherProvider
      .getForecast('')
      .subscribe(currentWeather => {
          this.weather = currentWeather
      });
  }

}
