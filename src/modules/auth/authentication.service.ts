import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';

import {
  ChangePwdDto,
  InviteUserDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto';
import { AuthFactoryHelper } from './helpers/auth-factory.helper';
import { IJwtRefreshPayload, IPreJwtPayload } from './interfaces';
import { IResponseMessage } from '../../interfaces';
// import { MailClientService } from '../mail-client/mail-client.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authFactory: AuthFactoryHelper,
    // private readonly mailClientService: MailClientService,
    private readonly authHelper: AuthFactoryHelper,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    const issuedTime = Math.floor(new Date().getTime() / 1000);

    const subject: IJwtRefreshPayload = { sub: user.id, issuedAt: issuedTime };
    const payload: IPreJwtPayload = {
      sub: user.id,
      issuedAt: issuedTime,
      ...plainToInstance(UserEntity, user),
    };

    return {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get(
          'authentication.refreshTokenExpiresInSec',
        ),
      }),
      accessToken: this.jwtService.sign(
        { ...payload },
        {
          expiresIn: this.configService.get(
            'authentication.accessTokenExpiresInSec',
          ),
        },
      ),
    };
  }

  async refreshToken(userId: string) {
    const user = await this.userService.findOne(userId);

    delete user.password;

    const payload = { sub: user.id, ...user };

    return {
      accessToken: this.jwtService.sign(
        { ...payload },
        {
          expiresIn: this.configService.get(
            'authentication.accessTokenExpiresInSec',
          ),
        },
      ),
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<UserEntity | IResponseMessage> {
    if (!['12345678', 'gct_2024', 'INC_2024'].includes(registerDto.code))
      throw new BadRequestException('AUTH::INVALID_COMPANY_CODE');

    const existedUer = await this.userService.findOneBy({
      email: registerDto.email,
    });

    if (existedUer) {
      // await this.mailClientService.sendExistedRegisterEmail({
      //   to: existedUer.email,
      //   context: {
      //     name: existedUer.name,
      //     loginLink: this.authHelper.getUrlLogin(),
      //   },
      // });

      return this.authFactory.resFactory('AUTH::REGISTER_SUCCESS');
    }

    const password = this.authFactory.passwordFactory();
    const user = await this.userService.create({ ...registerDto, password });

    // await this.mailClientService.sendRegisterEmail({
    //   to: user.email,
    //   context: {
    //     pwd: password,
    //     name: user.name,
    //     loginLink: this.authFactory.getUrlLogin(),
    //   },
    // });

    return plainToInstance(UserEntity, user);
  }

  async forgotPassword(email: string): Promise<IResponseMessage> {
    const user = await this.userService.findByEmail(email);
    const forgotPwdInfo = await this.authHelper.prepareForgotPwdInfo();

    // await Promise.all([
    //   this.cacheManager.set(
    //     forgotPwdInfo.key,
    //     user.id,
    //     this.configService.get('authentication.resetPasswordExpire') * 1000,
    //   ),
    //   this.mailClientService.sendForgotPwdEmail({
    //     to: email,
    //     context: {
    //       name: user.name,
    //       resetPwdLink: forgotPwdInfo.url,
    //     },
    //   }),
    // ]);

    return this.authFactory.resFactory('AUTH::FORGOT_PWD_SENT');
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('AUTH::USERNAME_OR_PASS_INCORRECT');
    }

    if (!this.authHelper.comparePassword(password, user.password)) {
      throw new UnauthorizedException('AUTH::USERNAME_OR_PASS_INCORRECT');
    }

    return user;
  }

  async resetPassword(
    resetPwdDto: ResetPasswordDto,
  ): Promise<IResponseMessage> {
    // const userId = await this.cacheManager.get(
    //   this.authHelper.getKeyForgotPwd(resetPwdDto.token),
    // );

    // if (!userId || typeof userId !== 'string')
    //   throw new UnauthorizedException('AUTH::RESET_TOKEN_INVALID');

    // const user = await this.userService.findOne(userId);

    // await Promise.all([
    //   this.userService.updatePassword(userId, resetPwdDto.password),
    //   this.mailClientService.sendResetPwdEmail({
    //     to: user.email,
    //     context: {
    //       name: user.name,
    //     },
    //   }),
    // ]);

    return this.authFactory.resFactory('AUTH::RESET_PASSWORD_SUCCESS');
  }

  async changePassword(
    email: string,
    payload: ChangePwdDto,
  ): Promise<IResponseMessage> {
    const user = await this.validateUser(email, payload.password);

    await Promise.all([
      this.userService.updatePassword(user.id, payload.newPassword),
      // this.mailClientService.sendChangePwdEmail({
      //   to: user.email,
      //   context: {
      //     name: user.name,
      //   },
      // }),
    ]);

    return this.authFactory.resFactory('AUTH::CHANGE_PASSWORD_SUCCESS');
  }

  async inviteUser(payload: InviteUserDto) {
    const emailsInSystem = await this.userService.getListEmailInSystem(
      payload.emails,
    );

    const emailsValid = Array.from(new Set(payload.emails)).filter(
      (email) => !emailsInSystem.includes(email),
    );

    const inviteInfo = await this.authHelper.prepareInviteInfo(payload.code);

    const promises = [];
    let totalEmail = emailsValid.length;
    while (totalEmail > 0) {
      promises
        .push
        // this.mailClientService.sendInviteEmail({
        //   to: emailsValid[totalEmail - 1],
        //   context: {
        //     code: inviteInfo.code,
        //     registerLink: inviteInfo.url,
        //   },
        // }),
        ();
      totalEmail--;
      if (totalEmail === 0 || promises.length % 10 === 0) {
        await Promise.all(promises);
        promises.length = 0;
      }
    }

    return {
      sent: emailsValid.length,
      existedEmails: emailsInSystem,
    };
  }
}
