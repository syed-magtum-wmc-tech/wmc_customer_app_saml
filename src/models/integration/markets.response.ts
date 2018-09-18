export interface MarketsResponse {
  markets: Array<MarketResponse>;
  totals : MarketResponse;
}

interface MarketResponse {
  id         : number;
  model_name : string;
  code       : string;
  description: string;
  count      : number;
  yrd_shipped: string;
  yrd_total  : string;
}