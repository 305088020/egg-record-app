// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCustomer from '../../../app/controller/customer';
import ExportDisease from '../../../app/controller/disease';
import ExportHome from '../../../app/controller/home';
import ExportUsers from '../../../app/controller/users';
import ExportWechat from '../../../app/controller/wechat';

declare module 'egg' {
  interface IController {
    customer: ExportCustomer;
    disease: ExportDisease;
    home: ExportHome;
    users: ExportUsers;
    wechat: ExportWechat;
  }
}
