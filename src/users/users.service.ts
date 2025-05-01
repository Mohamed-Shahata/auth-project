import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { AuthProviders } from "./providers/auth.provider";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authProviders: AuthProviders
  ) { };


  /**
   * Create new user
   * @param registerDto data for creating new user 
   * @returns JWT (accessToken)
   */
  public async register(registerDto: RegisterDto) {
    return this.authProviders.register(registerDto);
  }


  /**
   * Login user
   * @param loginDto data for log in to user account 
   * @returns JWT (accessToken)
   */
  public async login(loginDto: LoginDto) {
    return this.authProviders.login(loginDto);
  }



  /**
   * Get current user (logged in user)
   * @param id id of the logged in user
   * @returns the user from the database
   */
  public async getCurrentUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("user not found");
    return user;
  }


  /**
   * Verify Email
   * @param userId id of the user from the link
   * @param verificationToken verification token from the link
   * @returns success message
   */
  public async verifyEmail(userId: number, verificationToken: string) {
    const user = await this.getCurrentUser(userId);

    if (user.verificationToken === null)
      throw new NotFoundException("there is no verification token")

    if (user.verificationToken !== verificationToken)
      throw new BadRequestException("invalid token")

    user.isAccountVerify = true;
    user.verificationToken = null;

    await this.userRepository.save(user);
    return { message: "Your email has been verified, please log in to your account" };
  };

};