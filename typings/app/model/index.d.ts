// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCustomer from '../../../app/model/customer';
import ExportDisease from '../../../app/model/disease';
import ExportUser from '../../../app/model/user';
import ExportWechat from '../../../app/model/wechat';

declare module 'egg' {
  interface IModel {
    Customer: ReturnType<typeof ExportCustomer>;
    Disease: ReturnType<typeof ExportDisease>;
    User: ReturnType<typeof ExportUser>;
    Wechat: ReturnType<typeof ExportWechat>;
  }
}
