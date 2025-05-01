import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { RegisterDto } from "../dtos/register.dto";
import { AccessTokenType, JWTPayloadType } from "src/utils/types";
import { LoginDto } from "../dtos/login.dto";
import * as bcrypt from "bcryptjs";
import { MailService } from "src/mail/mail.service";
import { randomBytes } from "node:crypto";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordDto } from "../dtos/reset-password.dto";


@Injectable()
export class AuthProviders {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService
  ) { };

  /**
   * Create new user
   * @param registerDto data for creating new user 
   * @returns JWT (accessToken)
   */
  public async register(registerDto: RegisterDto) {
    const { username, password, email } = registerDto;

    const userExist = await this.userRepository.findOne({ where: { email } });
    if (userExist) throw new BadRequestException("User already exist");

    const hashPassword = await this.hashPassword(password);

    let newUser = this.userRepository.create({
      username,
      email,
      password: hashPassword,
      verificationToken: randomBytes(32).toString("hex")
    });

    newUser = await this.userRepository.save(newUser);

    const link = this.generateLink(newUser.id, newUser.verificationToken!);

    await this.mailService.sendVerifyEmailTemplate(email, link);

    return { message: "Verification token has been sent to your email, please verify your email adderss" };
  }


  /**
   * Login user
   * @param loginDto data for log in to user account 
   * @returns JWT (accessToken)
   */
  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new BadRequestException("invalid email or password");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new BadRequestException("invalid email or password");

    if (user.verificationToken || user.isAccountVerify === false) {
      let verificationToken = user.verificationToken;

      if (!verificationToken) {
        user.verificationToken = randomBytes(32).toString("hex");
        const result = await this.userRepository.save(user);
        verificationToken = result.verificationToken;
      }

      const link = this.generateLink(user.id, user.verificationToken!);
      await this.mailService.sendVerifyEmailTemplate(email, link);

      return { message: "Verification token has been sent to your email, please verify your email adderss" };
    }

    const accessToken = await this.generateJWT({ id: user.id, userType: user.userType });

    return { accessToken };
  };


  /**
 * Hassing password
 * @param password plain text password
 * @returns hashed password
 */
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
 * Generate Json Web Token
 * @param payload JWT Payload
 * @returns Token
 */
  private generateJWT(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /**
   * Genrate email verification link
   */
  private generateLink(userId: number, verificationToken: string) {
    return `${this.config.get<string>("DOMAIN")}/api/users/verify-email/${userId}/${verificationToken}`
  }
}