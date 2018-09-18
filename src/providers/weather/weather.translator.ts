import _ from 'lodash';
import * as moment from 'moment-timezone';

import { WeatherResponse, WeatherModel } from '../../models/models';

export abstract class WeatherTranslator {

  public static toWeatherModels(resp: WeatherResponse) {
    return _(resp.data.list).map(forecast => {
      let weather = _.head(forecast.weather);

      return new WeatherModel({
        date: forecast.dt,
        temp: `${_.round(forecast.main.temp)}\xB0`,
        high: `${_.round(forecast.main.temp_max)}\xB0`,
        low : `${_.round(forecast.main.temp_min)}\xB0`,
        icon: `https://openweathermap.org/img/w/${weather.icon}.png`,
      });
    }).value();
  }

  public static toForecastModel(models: WeatherModel[], dateStr: string, time_zone_name ?: string) {
    let date;
    if (dateStr) {
      date = time_zone_name && moment.tz(dateStr, time_zone_name) || moment(dateStr);
    } else {
      date = time_zone_name && moment.tz(time_zone_name) || moment();
    }

    return _(models)
      .sortBy('date')
      .find(model => moment.unix(_.toNumber(model.date)).isAfter(date));
  }

}
