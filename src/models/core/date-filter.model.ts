interface DateFilterInterface {
  display  : string;
  startDate: string;
  endDate  : string;
}

export class DateFilterModel {
  display  : string;
  startDate: string;
  endDate  : string;

  constructor(obj?: DateFilterInterface) {
    this.display   = obj && obj.display;
    this.startDate = obj && obj.startDate;
    this.endDate   = obj && obj.endDate;
  }
}
