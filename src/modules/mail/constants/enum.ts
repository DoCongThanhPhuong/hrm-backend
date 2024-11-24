export enum EEmailSubject {
  FORGOT_PASSWORD = '[HRM] Forgot password email',
  CHANGE_PASSWORD = '[HRM] Change password email',
  RESET_PASSWORD = '[HRM] Reset password email',
  REGISTER_PASSWORD = '[HRM] Register email',
  INVITE = '[HRM] Invite email',
  INVITE_MESSAGE = '[HRM] Invite message email',
  ADMIN_INVITE = '[HRM] Welcome to HRM app',
}

export enum EEmailTemplate {
  FORGOT_PASSWORD = './forgot-password.hbs',
  CHANGE_PASSWORD = './change-password.hbs',
  RESET_PASSWORD = './reset-password.hbs',
  REGISTER_PASSWORD = './register.hbs',
  REGISTER_EXISTED_EMAIL = './register-existed-email.hbs',
  INVITE = './invite-user.hbs',
  INVITE_MESSAGE = './invite-message.hbs',
  ADMIN_INVITE = './admin-invite-user.hbs',
  ASSIGN_TOPIC = './assign-topic.hbs',
}

export enum EEmailAssetName {
  LOGO = 'logo.png',
  VERIFY_EMAIL = 'verify-email.png',
  REGISTER_IMG = 'register-img.png',
  RESET_PW_IMG = 'reset-pw-img.png',
  TIMER_IMG = 'timer.png',
  INVITE_MESSAGE = 'invite-message.png',
}
