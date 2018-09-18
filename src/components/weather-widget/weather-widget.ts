import { Observable } from 'rxjs/Observable';

import { Component, OnInit, Input } from '@angular/core';

import { WeatherProvider } from '../../providers/providers';
import { WeatherModel } from '../../models/models';


@Component({
  selector: 'weather-widget',
  templateUrl: 'weather-widget.html'
})
export class WeatherWidget implements OnInit {

  @Input() date?: string;
  @Input() mode?: string;
  @Input() customerIndex?: number;

  isAccontPage:boolean = false;
  
  weather$: Observable<WeatherModel>;

  constructor(public weatherProvider: WeatherProvider) { }

  ngOnInit() {

    if(this.mode == "WmcCustomers") {
      this.isAccontPage = true;
      this.weather$ = this.weatherProvider.getCustomerAccountForecast(this.customerIndex);
    } else {
      this.weather$ = this.weatherProvider.getForecast(this.date);
    }
  }


}
