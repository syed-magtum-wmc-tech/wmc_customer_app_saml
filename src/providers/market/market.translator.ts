import _ from 'lodash';
import * as moment from 'moment';

import { MarketsResponse, RegionsResponse, DateFiltersResponse, MarketModel, RegionModel, DateFilterModel } from '../../models/models';

export abstract class MarketTranslator {

  public static toMarketModels(resp: MarketsResponse) {
    let markets = _(resp.markets).map(market => new MarketModel({
      id            : market.id,
      class         : market.model_name,
      code          : market.code,
      name          : market.description,
      totalOrders   : market.count,
      completedYards: market.yrd_shipped && _.round(_.toNumber(market.yrd_shipped)) || 0,
      totalYards    : market.yrd_total && _.round(_.toNumber(market.yrd_total)) || 0 
    })).value();
    markets = _.sortBy(markets, function(market) { return market.name; });


    let summaryMarket = [new MarketModel({
      id            : null,
      class         : resp.totals.model_name,
      code          : resp.totals.code,
      name          : resp.totals.description,
      totalOrders   : resp.totals.count,
      completedYards: resp.totals.yrd_shipped && _.round(_.toNumber(resp.totals.yrd_shipped)) || 0,
      totalYards    : resp.totals.yrd_total && _.round(_.toNumber(resp.totals.yrd_total)) || 0,
    })];

    return _.concat(summaryMarket, markets);
  }

  public static toRegionModels(resp: RegionsResponse) {
    let regions = _(resp.regions).map(region => new RegionModel({
      id            : region.id,
      class         : region.model_name,
      name          : region.description,
      totalOrders   : region.count,
      completedYards: region.yrd_shipped && _.round(_.toNumber(region.yrd_shipped)) || 0,
      totalYards    : region.yrd_total && _.round(_.toNumber(region.yrd_total)) || 0,
    })).value();
    regions = _.sortBy(regions, function(region) { return region.name; });

    let summaryRegion = [new RegionModel({
      id            : null,
      class         : resp.totals.model_name,
      name          : resp.totals.description,
      totalOrders   : resp.totals.count,
      completedYards: resp.totals.yrd_shipped && _.round(_.toNumber(resp.totals.yrd_shipped)) || 0,
      totalYards    : resp.totals.yrd_total && _.round(_.toNumber(resp.totals.yrd_total)) || 0
    })];

    return _.concat(summaryRegion, regions);
  }

  public static toDateFilterModels(resp: DateFiltersResponse) {
    return _(resp.users).map(arr => new DateFilterModel({
      display  : _.nth(arr, 0),
      startDate: _.nth(arr, 1),
      endDate  : _.nth(arr, 2)
    })).value();
  }

  public static defaultDateFilterModels() {
    return [new DateFilterModel({
      display  : 'Today',
      startDate: moment().format('YYYY-MM-DD'),
      endDate  : moment().format('YYYY-MM-DD')
    })]
  }

}
