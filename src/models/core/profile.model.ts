import { LoginModel } from './login.model'

interface ProfileInterface {
  fullName      : string;
  username      : string;
  userId        : number;
  email         : string;
  logo          : string;
  receiveEmail  : boolean;
  internal      : boolean;
  linkedProfiles?: Array<LoginModel>;
}

export class ProfileModel {
  fullName      : string;
  username      : string;
  userId        : number;
  email         : string;
  logo          : string;
  receiveEmail  : boolean;
  internal      : boolean;
  linkedProfiles?: Array<LoginModel>;

  constructor(obj?: ProfileInterface) {
    this.fullName       = obj && obj.fullName;
    this.username       = obj && obj.username;
    this.userId         = obj && obj.userId;
    this.email          = obj && obj.email;
    this.logo           = obj && obj.logo;
    this.receiveEmail   = obj && obj.receiveEmail;
    this.internal       = obj && obj.internal;
    this.linkedProfiles = obj && obj.linkedProfiles;
  }
}

interface UserProfileInterface {
  userId        : number;
  fullName      : string;
  username      : string;
  auth_token    : string;
  email         : string;
  phone_number  : string;
  internal      : boolean;
  receiveEmail  : boolean;
  wmc_dmin      : boolean;
}


export class UserProfileModel {
  userId        : number;
  fullName      : string;
  username      : string;
  auth_token    : string;
  email         : string;
  phone_number  : string;
  internal      : boolean;
  receiveEmail  : boolean;
  wmc_dmin      : boolean;
  
  constructor(obj?: UserProfileInterface) {
    this.userId       = obj && obj.userId;
    this.fullName     = obj && obj.fullName;
    this.username     = obj && obj.username;
    this.auth_token   = obj && obj.auth_token;
    this.email        = obj && obj.email;
    this.phone_number = obj && obj.phone_number;
    this.internal     = obj && obj.internal;
    this.receiveEmail  =  obj && obj.receiveEmail;
    this.wmc_dmin     = obj && obj.wmc_dmin;
  }
}