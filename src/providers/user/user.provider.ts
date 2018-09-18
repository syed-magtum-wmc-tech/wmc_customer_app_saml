import _ from 'lodash';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Api } from '../api/api';
import { Storage } from '@ionic/storage';

import { Events } from 'ionic-angular';

import { UserTranslator } from './user.translator';
import {  LoginResponse, LoginModel, ProfileModel, LinkProfileModel, UserProfileModel } from '../../models/models';
import {CentralLoginResponse, CentralDetailResponse } from '../../models/integration/login.response';
import { Constants } from '../../app/app.constants';

@Injectable()
export class User {
  _user: LoginModel;

  constructor(public api: Api,
              public storage: Storage,
              public events: Events) { }

  login(credentials: any) {
    return this.api
      .postWithDefaultHeaders(`customer_app_api_login?username=${credentials.username}&password=${credentials.password}`)
      .flatMap((resp: CentralLoginResponse) => this.handleCentralLogin(resp, credentials))
      //.flatMap((resp: LoginResponse) => this.handleLogin(resp, credentials));
  }

  saml_login(credentials: any) {
    return this.api
      .postWithDefaultHeaders(`customer_app_api_login?id=${credentials.id}&username=${credentials.username}&mobile_api_key=${Constants.MOBILE_API_KEY}`)
      .flatMap((resp: CentralLoginResponse) => this.handleCentralLogin(resp, credentials))
      //.flatMap((resp: LoginResponse) => this.handleLogin(resp, credentials));
  }
  
  handleCentralLogin(resp: CentralLoginResponse, credentials?: any) {

    return Observable
      .fromPromise(this.storage.get('wmc_customers'))
      .map((wmc_customers: LoginModel[]) => {
        let rememberMe = credentials && credentials.rememberMe;
        let models:LoginModel[] = [];
        let resp_wmc_customers:any   = _.orderBy(resp.user_wmc_customers, function(customer) { return customer.wmc_customer_id} ) ;
        console.log('before order',resp.user_wmc_customers);
        console.log('after order',resp_wmc_customers);
        _.each(resp_wmc_customers, function(wmc_customer){
            models.push(UserTranslator.toLoginModel(wmc_customer, rememberMe));
        }) 
        this.storage.set('wmc_customers', models);
        let userProfileModel:UserProfileModel = UserTranslator.toUserProfileModel(resp); 
        this.storage.set('user:profile', userProfileModel);
        return models;
      });
  }

  handleLogin(resp: LoginResponse, credentials?: any) {
    return Observable
      .fromPromise(this.storage.get('user'))
      .map((user: LoginModel) => {
        let rememberMe = credentials && credentials.rememberMe || user && user.rememberMe;
        let model = UserTranslator.toLoginModel(resp, rememberMe);

        if (!model.auth_token || !model.userId) {
          throw new Error('Invalid User Account');
        }

        credentials && this.events.publish('user:login', model);
        this.storage.set('user', model);
        this._user = model;
        return model;
    });
  }

  updateCentralDeatail(resp: CentralDetailResponse) {

    let userProfileModel:UserProfileModel = new UserProfileModel({
                                              userId       : resp.id && resp.id || resp['user_id'],
                                              fullName     : resp.full_name,
                                              username     : resp.username,
                                              auth_token   : resp.auth_token,
                                              email        : resp.email,
                                              phone_number : resp.phone_number,
                                              internal     : resp.internal,
                                              wmc_dmin     : resp.wmc_dmin,
                                              receiveEmail : resp.order_emails,
                                            });

    this.storage.set('user:profile', userProfileModel);
    return userProfileModel;
  }

  logout() {
    this.storage.set('user', null);
    this.storage.set('wmc_customers', null);
    this.storage.set('user:profile', null);
    
    this._user = null;
  }

  refreshUser() {
    return Observable
      .fromPromise(this.storage.get('user'))
      .flatMap((model: LoginModel) => this.api.get(`users/${model.userId}.json`))
      .flatMap((resp: LoginResponse) => this.handleLogin(resp));
  }

  changeUser(newUser: LoginModel) {
    return Observable
      .fromPromise(this.storage.get('user'))
      .flatMap((oldUser: LoginModel) => {
        newUser.rememberMe = oldUser.rememberMe;
        this.events.publish('user:changed-user', newUser);
        return Observable
          .fromPromise(this.storage.set('user', newUser))
          .flatMap(user => this.refreshUser());
      });
  }

 
  getProfile() {
     
    return Observable.zip(Observable.fromPromise(this.storage.get('user')),Observable.fromPromise(this.storage.get('user:profile')))
           .map(([model, userprofile]) => UserTranslator.toProfileModel(model as LoginModel, userprofile as UserProfileModel)) 
    
  }

  updateProfile(model: ProfileModel) {
    return this.api
      .centralPatch(`users/${model.userId}.json`, UserTranslator.toProfileUpdateRequest(model))
      .map((resp: CentralDetailResponse) => this.updateCentralDeatail(resp))

      /*return this.api
      .formPut(`users/${model.userId}.json`, UserTranslator.toProfileUpdateRequest(model))
      .map((resp: CentralDetailResponse) => this.updateCentralDeatail(resp))*/

  }

  resetPassword(model: ProfileModel, password: string, password_confirmation: string) {
    return this.api
      .centralPatch(`users/${model.userId}.json`, UserTranslator.toPasswordResetRequest(password, password_confirmation))
      .catch(err => { console.log('err',err);  return  Observable.throw(err && _.isArray(err.error) && _.head(err.error))})
      .map((resp: CentralDetailResponse) => this.updateCentralDeatail(resp))

     /*return this.api
     .formPut(`users/${model.userId}.json`, UserTranslator.toPasswordResetRequest(password, password_confirmation))
     .catch(err => Observable.throw(err && err.error && _.head(err.error.users)))
     .map((resp: CentralDetailResponse) => this.updateCentralDeatail(resp));*/

  }

  linkProfile(profile: LinkProfileModel) {
    return this.api
      .post('linked_users', profile)
      .map((resp: LoginResponse) => UserTranslator.toLoginModel(resp, false));
  }

  forgotPassword(email: string) {
    return this.api.centralPost('password_reset.json', { email: email });
    //return this.api.post('password_reset.json', { email: email });
  }

}