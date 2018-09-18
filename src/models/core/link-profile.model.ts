interface LinkProfileInterface {
  username: string;
  password: string;
}

export class LinkProfileModel {
  username: string;
  password: string;

  constructor(obj?: LinkProfileInterface) {
    this.username = obj && obj.username;
    this.password = obj && obj.password;
  }
}
