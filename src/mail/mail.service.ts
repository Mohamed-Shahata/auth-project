import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { User } from "src/users/user.entity";


@Injectable()
export class MailService {

  constructor(
    private readonly mailerService: MailerService
  ) { };


  /**
   * sending email after user logged in his account
   * @param email the logged in user
   */
  public async sendLogEmail(email: string) {
    try {
      const today = new Date();
      await this.mailerService.sendMail({
        to: email,
        from: "mohamedmrslan@gmail.com",
        subject: "Login",
        template: "login",
        context: { email, today }
      })
    } catch (error) {
      console.log("Error: ", error);
      throw new RequestTimeoutException();
    }
  }

  /**
   * Sending verify email template
   * @param email email of the registered user
   * @param link link with id of the user and verification token
   */
  public async sendVerifyEmailTemplate(email: string, link: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: "mohamedmrslan@gmail.com",
        subject: "Verify your account",
        template: "verify-email",
        context: { link }
      })
    } catch (error) {
      console.log("Error: ", error);
      throw new RequestTimeoutException();
    }
  }

}