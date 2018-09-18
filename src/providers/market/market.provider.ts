import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/publishReplay';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { MarketTranslator } from './market.translator';
import { MarketsResponse, RegionsResponse, DateFiltersResponse, DateFilterModel } from '../../models/models';

@Injectable()
export class MarketProvider {

  constructor(public api: Api) { }

  getMarkets(dateFilter?: DateFilterModel, customerIndex?: number) {
    let params = {
      start_date: dateFilter && dateFilter.startDate || moment().format('YYYY-MM-DD'),
      end_date  : dateFilter && dateFilter.endDate   || moment().format('YYYY-MM-DD')
    };

    return this.api
      .get('markets.json', params, customerIndex)
      .map((resp: MarketsResponse) => MarketTranslator.toMarketModels(resp));
  }

  getRegions(marketId: number, marketClass: string, dateFilter?: DateFilterModel) {
    let params = {
      start_date : dateFilter && dateFilter.startDate || moment().format('YYYY-MM-DD'),
      end_date   : dateFilter && dateFilter.endDate   || moment().format('YYYY-MM-DD'),
      model_id   : marketId,
      model_class: marketClass
    };

    return this.api
      .get(`find_markets.json`, params)
      .map((resp: RegionsResponse) => MarketTranslator.toRegionModels(resp));
  }

  getDateFilters(customerIndex ?: number) {
    return this.api
      .get(`api/v1/users/preferred_date_filters.json`, null, customerIndex)
      .map((resp: DateFiltersResponse) => MarketTranslator.toDateFilterModels(resp))
      .catch(err => Observable.of(MarketTranslator.defaultDateFilterModels()))
      .publishReplay(1)
      .refCount();
  }

}
