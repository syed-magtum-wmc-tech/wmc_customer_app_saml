import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { UrlOptions, HeaderParams } from './api.config';

import _ from 'lodash';

@Injectable()
export class Api {
 
  constructor(public http: HttpClient,
              public storage: Storage) { }

  getUser(customerIndex ?: number) {

    if(customerIndex || customerIndex == 0) {
       return Observable.fromPromise(this.storage.get('wmc_customers'));
    } else {
      return Observable.fromPromise(this.storage.get('user'));
    }
    
  }

  getCentralUser() {
    return Observable.fromPromise(this.storage.get('user:profile'));
  }

  getHeaders(users: any, customerIndex ?: number) {
    {
      let user = null;
      if(_.isArray(users)){
        user = users[customerIndex];
      } else {
        user = users;
      }
      return user ? new UrlOptions({
      url: user.url,
      headers: new HeaderParams({ 
        headers: new HttpHeaders({
          'X-AUTH': `${user.auth_token}`,
          'X-ID': `${user.userId}`,
          'Content-Type': 'application/json'
        }),
        params: new HttpParams()
      })}) : new UrlOptions();
    }
  }

  getHeaderForm(users: any, customerIndex ?: number) {
  {
      let user = null;
      if(_.isArray(users)){
        user = users[customerIndex];
      } else {
        user = users;
      }
      return user ? new UrlOptions({
      url: user.url,
      headers: new HeaderParams({ 
        headers: new HttpHeaders({
          'X-AUTH': `${user.auth_token}`,
          'X-ID': `${user.userId}`,
        }),
        params: new HttpParams()
      })}) : new UrlOptions();
    }
  }

  setReqOpts(options: UrlOptions, params, endpoint) {
    let reqOpts: UrlOptions = {...options};

    if (reqOpts.headers && params) {
      for (let k in params) {
        reqOpts.headers.params = reqOpts.headers.params.set(k, params[k]);
      }
    }

    return reqOpts;
  }

  get(endpoint: string, params?: any, customerIndex?: number ) {
    return this.getUser(customerIndex)
      .map(user => this.getHeaders(user, customerIndex))
      .map(options => this.setReqOpts(options, params, endpoint))
      .flatMap(reqOpts => this.http.get(reqOpts.url + '/' + endpoint, reqOpts.headers));
  }

  post(endpoint: string, body?: any, reqOpts?: any) {
    return this.getUser()
      .map(user => this.getHeaders(user))
      .flatMap(options => this.http.post(options.url + '/' + endpoint, body, options.headers));
  }

  postWithDefaultHeaders(endpoint: string, body?: any, reqOpts?: any) {
    return Observable.from([ this.getHeaders(null) ])
      .flatMap(options => this.http.post(options.url + '/' + endpoint, body, options.headers));
  }

  formPost(endpoint: string, body?: any, reqOpts?: any) {
    return this.getUser()
      .map(user => this.getHeaderForm(user))
      .flatMap(options => this.http.post(options.url + '/' + endpoint, body, options.headers));
  }

  formPut(endpoint: string, body?: any, reqOpts?: any) {
    return this.getUser()
      .map(user => this.getHeaderForm(user))
      .flatMap(options => this.http.patch(options.url + '/' + endpoint, body, options.headers));
  }

  centralGet(endpoint: string, params?: any, customerIndex?: number ) {
    return this.getCentralUser()
      .map(user => this.getHeaders(user, customerIndex))
      .map(options => this.setReqOpts(options, params, endpoint))
      .flatMap(reqOpts => this.http.get(reqOpts.url + '/' + endpoint, reqOpts.headers));
  }

  centralPost(endpoint: string, body?: any, reqOpts?: any) {
    return this.getCentralUser()
      .map(user => this.getHeaders(user))
      .flatMap(options => this.http.post(options.url + '/' + endpoint, body, options.headers));
  }

  centralPut(endpoint: string, body?: any, reqOpts?: any) {
    return this.getCentralUser()
      .map(user => this.getHeaders(user))
      .flatMap(options => this.http.put(options.url + '/' + endpoint, body, options.headers));
  }

  centralPatch(endpoint: string, body?: any, reqOpts?: any) {
    return this.getCentralUser()
      .map(user => this.getHeaders(user))
      .flatMap(options => this.http.patch(options.url + '/' + endpoint, body, options.headers));
  }

  centralFormPost(endpoint: string, body?: any, reqOpts?: any) {
    return this.getCentralUser()
      .map(user => this.getHeaderForm(user))
      .flatMap(options => this.http.post(options.url + '/' + endpoint, body, options.headers));
  }

  centralFormPut(endpoint: string, body?: any, reqOpts?: any) {
    return this.getCentralUser()
      .map(user => this.getHeaderForm(user))
      .flatMap(options => this.http.patch(options.url + '/' + endpoint, body, options.headers));
  }

  centralFormPatch(endpoint: string, body?: any, reqOpts?: any) {
    return this.getCentralUser()
      .map(user => this.getHeaderForm(user))
      .flatMap(options => this.http.patch(options.url + '/' + endpoint, body, options.headers));
  }
}
