interface MarketInterface {
  id            : number;
  class         : string;
  code          : string;
  name          : string;
  totalOrders   : number;
  completedYards: number;
  totalYards    : number;
}

export class MarketModel {
  id            : number;
  class         : string;
  code          : string;
  name          : string;
  totalOrders   : number;
  completedYards: number;
  totalYards    : number;

  constructor(obj?: MarketInterface) {
    this.id             = obj && obj.id;
    this.class          = obj && obj.class;
    this.code           = obj && obj.code;
    this.name           = obj && obj.name;
    this.totalOrders    = obj && obj.totalOrders;
    this.completedYards = obj && obj.completedYards;
    this.totalYards     = obj && obj.totalYards;
  }
}
