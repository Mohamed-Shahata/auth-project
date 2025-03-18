import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { AccessTokenType, JWTPayloadType } from "src/utils/types";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserType } from "src/utils/enum";
import { AuthProviders } from "./providers/auth.provider";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { join } from "node:path";
import { unlinkSync } from "node:fs";
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
   * Get all users from the database
   * @returns collection of users
   */
  public getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Update user
   * @param id id of the logged in user
   * @param updateUserDto data for updating th user
   * @returns updated user from the database
   */
  public async update(id: number, updateUserDto: UpdateUserDto) {
    const { username, password } = updateUserDto;
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException("user not found")

    user.username = username ?? user.username;
    if (password) {
      user.password = await this.authProviders.hashPassword(password);
    }
    return await this.userRepository.save(user);
  }

  /**
   * Delete user
   * @param userId id of user
   * @param payload JWTPayload
   * @returns a success message
   */
  public async delete(userId: number, payload: JWTPayloadType) {
    const user = await this.getCurrentUser(userId);
    if (user.id === payload?.id || payload.userType === UserType.ADMIN) {
      await this.userRepository.remove(user);
      return { message: "User has been deleted" }
    }
    throw new ForbiddenException("access denied, you are not allowed")
  };


  /**
   *  Set profle image
   * @param userId id of the logged in user
   * @param newProfileImage profile image
   * @returns the user from the database
   */
  public async setProfileImage(userId: number, newProfileImage: string) {
    const user = await this.getCurrentUser(userId);

    if (!user.profileImage) {
      user.profileImage = newProfileImage;
    } else {
      await this.removeProfileImage(userId);
      user.profileImage = newProfileImage;
    }

    return this.userRepository.save(user);
  }

  /**
   * Remove profile image
   * @param userId id of the logged in user
   * @returns the user from the database
   */
  public async removeProfileImage(userId: number) {
    const user = await this.getCurrentUser(userId);
    if (!user.profileImage)
      throw new BadRequestException("there is no profile image");

    const imagePath = join(process.cwd(), `./images/users/${user.profileImage}`);

    // remove image
    unlinkSync(imagePath);

    user.profileImage = null;
    return this.userRepository.save(user);
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

  /**
   * Sending reset password teplate
   * @param email email of the user
   * @returns a success message
   */
  public sendResetPassword(email: string) {
    return this.authProviders.sendResetPasswordLink(email);
  }

  /**
   * Get reset password link
   * @param userId user id from the link
   * @param resetPasswordToken reset password token from the link
   * @returns a success message
   */
  public getResetPassword(userId: number, resetPasswordToken: string) {
    return this.authProviders.getResetPasswordLink(userId, resetPasswordToken);
  };

  /**
   * Reset the password
   * @param dto data for reset the passsword
   * @returns a success message
   */
  public resetPassword(dto: ResetPasswordDto) {
    return this.authProviders.resetPassword(dto);
  }

};