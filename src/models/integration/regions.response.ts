export interface RegionsResponse {
  regions: Array<RegionResponse>;
  totals : RegionResponse;
}

interface RegionResponse {
  id         : number;
  model_name : string;
  description: string;
  count      : number;
  yrd_shipped: string;
  yrd_total  : string;
}