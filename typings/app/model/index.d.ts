// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCustomer = require('../../../app/model/customer');
import ExportUser = require('../../../app/model/user');

declare module 'egg' {
  interface IModel {
    Customer: ReturnType<typeof ExportCustomer>;
    User: ReturnType<typeof ExportUser>;
  }
}
