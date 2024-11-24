export interface ISendForgotPwdMail {
  to: string;
  context: IForgotPwdContext;
}

interface IForgotPwdContext {
  name: string;
  resetPwdLink: string;
}

export interface ISendResetPwdMail {
  to: string;
  context: IResetPwdContext;
}

interface IResetPwdContext {
  name: string;
}

export interface ISendChangePwdMail {
  to: string;
  context: IChangePwdContext;
}

interface IChangePwdContext {
  name: string;
}

export interface ISendExistedRegisterMail {
  to: string;
  context: IExistedRegisterContext;
}

interface IExistedRegisterContext {
  name: string;
  loginLink: string;
}

export interface ISendRegisterMail {
  to: string;
  context: IRegisterContext;
}

interface IRegisterContext {
  name: string;
  pwd: string;
  loginLink: string;
}

export interface ISendInviteMail {
  to: string[];
  context: IInviteContext;
}

interface IInviteContext {
  code: string;
  registerLink: string;
}

export interface ISendAdminInviteMail {
  to: string[];
  context: IAdminInviteContext;
}

interface IAdminInviteContext {
  companyName: string;
  pwd: string;
  userName: string;
  loginLink: string;
}

export interface ISendAssignTopicMail {
  to: string;
  context: IAssignTopic;
}

interface IAssignTopic {
  assignFrom: string;
  assignTo: string;
  categoryName: string;
  topicName: string;
  viewTopicUrl: string;
}
