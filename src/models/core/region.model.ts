interface RegionInterface {
  id            : number;
  class         : string;
  name          : string;
  totalOrders   : number;
  completedYards: number;
  totalYards    : number;
}

export class RegionModel {
  id            : number;
  class         : string;
  name          : string;
  totalOrders   : number;
  completedYards: number;
  totalYards    : number;

  constructor(obj?: RegionInterface) {
    this.id             = obj && obj.id;
    this.class          = obj && obj.class;
    this.name           = obj && obj.name;
    this.totalOrders    = obj && obj.totalOrders;
    this.completedYards = obj && obj.completedYards;
    this.totalYards     = obj && obj.totalYards;
  }
}
