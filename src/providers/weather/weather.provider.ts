import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/observable/timer';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { WeatherTranslator } from './weather.translator';
import { WeatherResponse, WeatherModel } from '../../models/models';
import { Subject } from 'rxjs';
import { User } from '../user/user.provider';

@Injectable()
export class WeatherProvider {

  weather$: Observable<WeatherModel[]>;
  unsubscribe_weather$ = new Subject();

  constructor(public api: Api, public user: User) { }

  getWeather() {
    if (!this.weather$) {
      this.weather$ = Observable
        .timer(0, 5*60*1000) // recheck the weather every 5 minutes
        .takeUntil(this.unsubscribe_weather$)
        .flatMap(() => this.api.get('weather.json').catch(err => []))
        .map((resp: WeatherResponse) => WeatherTranslator.toWeatherModels(resp))
        .publishReplay()
        .refCount();
    }

    return this.weather$;
  }

  getForecast(date: string) {
    let time_zone_name:string = this.user._user && this.user._user.time_zone_name || '';
    return this.getWeather().map(weather => WeatherTranslator.toForecastModel(weather, date, time_zone_name ));
  }


  getCustomerAccountForecast(customerIndex:number) {
      return Observable.zip(this.api.getUser(customerIndex),this.api.get('weather.json', {}, customerIndex))
          .map(([users ,resp]) =>  [users[customerIndex], WeatherTranslator.toWeatherModels(resp as WeatherResponse)] )
          .map(([user, weather]) =>  WeatherTranslator.toForecastModel(weather,null,user.time_zone_name));

  }


}
