import _ from 'lodash';

import {  LoginResponse,  LoginModel, ProfileModel, UserProfileModel } from '../../models/models';
import { CentralLoginResponse } from '../../models/integration/login.response';

export abstract class UserTranslator {

  public static toLoginModel(resp: LoginResponse, rememberMe: boolean) {
    return new LoginModel({
      dispatch_number: resp.dispatch_number,
      userId         : resp.user_id,
      internal       : resp.internal,
      receiveEmails  : resp.order_emails,
      email          : resp.email,
      auth           : resp.auth,
      auth_token     : resp.auth_token,
      username       : resp.username,
      logo           : resp.logo,
      url            : resp.url,
      unit           : resp.unit,
      fullName       : resp.full_name,
      rememberMe     : rememberMe,
      time_zone      : resp.time_zone, 
      time_zone_name : resp.time_zone_name, 
      order_chatting : resp.order_chatting,
      confirm_order  : resp.confirm_order,
      cancel_order   : resp.cancel_order,  
      chat_with_customer : resp.chat_with_customer,
      allow_customers_to_place_order_requests : resp.allow_customers_to_place_order_requests,
      

      linked_accounts: _(resp.linked_accounts).map(linked_account => new LoginModel({
        dispatch_number : linked_account.dispatch_number,
        userId          : linked_account.user_id,
        internal        : linked_account.internal,
        auth            : linked_account.auth,
        auth_token      : linked_account.auth_token,
        url             : linked_account.url,
        unit            : linked_account.unit,
        username        : linked_account.username,
        logo            : linked_account.logo,
        fullName        : linked_account.full_name,
        email           : linked_account.email,
        receiveEmails   : linked_account.order_emails,
        time_zone       : linked_account.time_zone, 
        time_zone_name  : linked_account.time_zone_name, 
        order_chatting  : linked_account.order_chatting,
        confirm_order   : linked_account.confirm_order,
        cancel_order    : linked_account.cancel_order,  
        chat_with_customer : linked_account.chat_with_customer,
        allow_customers_to_place_order_requests : linked_account.allow_customers_to_place_order_requests,
      
      })).value()
    })
  }

  
  public static toProfileModel(model: LoginModel, userProfile ?:UserProfileModel)  {
    return new ProfileModel({
      userId       : userProfile && userProfile.userId,
      fullName     : userProfile && userProfile.fullName,
      username     : userProfile && userProfile.username,
      email        : userProfile && userProfile.email,
      logo         : model.logo,
      receiveEmail : userProfile && userProfile.receiveEmail,
      internal     : userProfile.internal,
      linkedProfiles: model.linked_accounts
    });
  }

  public static toUserProfileModel(model: CentralLoginResponse) {
    return new UserProfileModel({
      userId       : model.user_id,
      fullName     : model.full_name,
      username     : model.username,
      auth_token   : model.auth_token,
      email        : model.email,
      phone_number : model.phone_number,
      internal     : model.internal,
      receiveEmail : model.user_wmc_customers && model.user_wmc_customers[0].order_emails,
      wmc_dmin     : model.wmc_dmin,    
    });
  }

  public static toProfileUpdateRequest(model: ProfileModel) {
    const body = {
       "user" : {
         "full_name" : model.fullName,
          "username" : model.username,
          "email"    : model.email 
       }
    };
    return body;
    
    /*const body = new FormData();

    model.fullName     && body.append('user[full_name]', model.fullName);
    model.username     && body.append('user[username]', model.username);
    model.email        && body.append('user[email]', model.email);
    body.append('user[opt_into_order_emails]', `${model.receiveEmail}`);

    return body;
    */
  }

  public static toPasswordResetRequest(password: string, password_confirmation: string) {
   const body = {
      "user" : {
        "password" : password,
         "password_confirmation" : password_confirmation
      }
   };
   return body;
   
  /*const body = new FormData();

    body.append('user[password]', password);
    body.append('user[password_confirmation]', password_confirmation);

    return body;
    */

   
  }

}
