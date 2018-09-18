import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Constants } from './../../app/app.constants';

interface UrlOptionsInterface {
  headers: HeaderParams;
  url    : string;
}

export class UrlOptions {
  headers: HeaderParams;
  url    : string;

  constructor(obj?: UrlOptionsInterface) {
    this.headers = obj && obj.headers;
    this.url = obj && obj.url || Constants.API_HOST;
  }
}

interface HeaderInterface {
  headers: HttpHeaders;
  params : HttpParams;
}

export class HeaderParams {
  headers: HttpHeaders;
  params : HttpParams;

  constructor(obj?: HeaderInterface) {
    this.headers = obj && obj.headers || new HttpHeaders();
    this.params  = obj && obj.params || new HttpParams();
  }
}
