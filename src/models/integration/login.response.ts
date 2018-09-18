export interface LoginResponse {
  dispatch_number : string;
  user_id         : number;
  internal        : boolean;
  auth            : string;
  auth_token      : string;
  order_emails    : boolean;
  wmc_customer_id : number;
  logo            : string;
  url             : string;
  unit            : string;
  username        : string;
  full_name       : string;
  email           : string;
  time_zone       : string;
  time_zone_name  : string;
  order_chatting  : boolean;
  confirm_order   : boolean;
  cancel_order    : boolean;
  chat_with_customer : boolean;
  allow_customers_to_place_order_requests : boolean;
  
      
  linked_accounts : Array<{
    dispatch_number : string;
    user_id         : number;
    internal        : boolean;
    auth            : string;
    auth_token      : string;
    logo            : string;
    url             : string;
    unit            : string;
    order_emails    : boolean;
    wmc_customer_id : number;
    username        : string;
    full_name       : string;
    email           : string;
    time_zone       : string;
    time_zone_name  : string;
    order_chatting  : boolean;
    confirm_order   : boolean;
    cancel_order    : boolean;
    chat_with_customer : boolean;
    allow_customers_to_place_order_requests : boolean;
   
  }>;
}

export interface CentralLoginResponse {
    user_id       : number;
    full_name     : string;
    username      : string;
    auth_token    : string;
    active        : boolean;
    email         : string;
    phone_number  : string;
    internal      : boolean;
    wmc_dmin      : boolean;
    user_wmc_customers : LoginResponse[];
}

export interface CentralDetailResponse {
  id            : number;
  full_name     : string;
  username      : string;
  auth_token    : string;
  active        : boolean;
  email         : string;
  phone_number  : string;
  internal      : boolean;
  wmc_dmin      : boolean;
  order_emails  : boolean;
}