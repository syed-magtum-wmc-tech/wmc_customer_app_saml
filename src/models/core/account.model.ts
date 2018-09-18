interface AccountInterface {
  username   : string;
  password   : string;
  rememberMe : boolean;
}

export class AccountModel {
  username   : string;
  password   : string;
  rememberMe : boolean;
  
  constructor(obj?: AccountInterface) {
    this.username   = obj && obj.username;
    this.password   = obj && obj.password;
    this.rememberMe = obj && obj.rememberMe;
  }
}
