// TODO: change these fields

interface LoginInterface {
  dispatch_number : string;
  userId          : number;
  internal        : boolean;
  auth            : string;
  auth_token      : string;
  rememberMe     ?: boolean;
  wmc_customer_id?: number;
  username        : string;
  fullName        : string;
  logo            : string;
  url             : string;
  unit            : string;
  email           : string;
  receiveEmails   : boolean;
  time_zone       : string;
  time_zone_name  : string;
  order_chatting  : boolean;
  confirm_order   : boolean;
  cancel_order    : boolean;
  chat_with_customer : boolean;
  allow_customers_to_place_order_requests : boolean;
 
  linked_accounts?: Array<LoginModel>;
}

export class LoginModel {
  dispatch_number : string;
  userId          : number;
  internal        : boolean;
  auth            : string;
  auth_token      : string;
  rememberMe     ?: boolean;
  wmc_customer_id?: number;
  username        : string;
  fullName        : string;
  logo            : string;
  url             : string;
  unit            : string;
  email           : string;
  receiveEmails   : boolean;
  time_zone       : string;
  time_zone_name  : string;
  order_chatting  : boolean;
  confirm_order   : boolean;
  cancel_order    : boolean;
  chat_with_customer : boolean;
  allow_customers_to_place_order_requests : boolean;
 
  linked_accounts?: Array<LoginModel>;

  constructor(obj?: LoginInterface) {
    this.dispatch_number = obj && obj.dispatch_number;
    this.userId          = obj && obj.userId;
    this.internal        = obj && obj.internal;
    this.auth            = obj && obj.auth;
    this.auth_token      = obj && obj.auth_token;
    this.rememberMe      = obj && obj.rememberMe;
    this.wmc_customer_id = obj && obj.wmc_customer_id;
    this.username        = obj && obj.username;
    this.fullName        = obj && obj.fullName;
    this.logo            = obj && obj.logo;
    this.url             = obj && obj.url;
    this.unit            = obj && obj.unit;
    this.email           = obj && obj.email;
    this.receiveEmails   = obj && obj.receiveEmails;
    this.time_zone       = obj && obj.time_zone;
    this.time_zone_name  = obj && obj.time_zone_name;
    this.order_chatting  = obj && obj.order_chatting;
    this.confirm_order   = obj && obj.confirm_order;
    this.cancel_order    = obj && obj.cancel_order;
    this.chat_with_customer = obj && obj.chat_with_customer;
    this.allow_customers_to_place_order_requests = obj && obj.allow_customers_to_place_order_requests;
    this.linked_accounts = obj && obj.linked_accounts;
  }

}
