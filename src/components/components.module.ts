import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { MenuHeader } from './menu-header/menu-header';
import { WeatherWidget } from './weather-widget/weather-widget';


@NgModule({
	declarations: [ MenuHeader, WeatherWidget],
	imports: [IonicModule],
	exports: [ MenuHeader,  WeatherWidget]
})
export class ComponentsModule {}
