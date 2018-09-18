interface WeatherInterface {
  temp : string;
  icon : string;
  date : string;
  high?: string;
  low ?: string;
}

export class WeatherModel {

  temp: string;
  icon: string;
  date: string;
  high: string;
  low : string;

  constructor(obj?: WeatherInterface) {
    this.temp = obj && obj.temp || '';
    this.icon = obj && obj.icon || '';
    this.date = obj && obj.date || '';
    this.high = obj && obj.high || '';
    this.low  = obj && obj.low  || '';
  }

}
