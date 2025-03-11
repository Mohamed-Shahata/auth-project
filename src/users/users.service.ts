import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenType, JWTPayloadType } from "src/utils/types";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserType } from "src/utils/enum";


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { };


  /**
   * Create new user
   * @param registerDto data for creating new user 
   * @returns JWT (accessToken)
   */
  public async register(registerDto: RegisterDto): Promise<AccessTokenType> {
    const { username, password, email } = registerDto;

    const userExist = await this.userRepository.findOne({ where: { email } });
    if (userExist) throw new BadRequestException("User already exist");

    const hashPassword = await this.hashPassword(password);

    let newUser = this.userRepository.create({
      username,
      email,
      password: hashPassword
    });

    newUser = await this.userRepository.save(newUser);

    const accessToken = await this.generateJWT({ id: newUser.id, userType: newUser.userType })

    return { accessToken }
  }


  /**
   * Login user
   * @param loginDto data for log in to user account 
   * @returns JWT (accessToken)
   */
  public async login(loginDto: LoginDto): Promise<AccessTokenType> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new BadRequestException("invalid email or password");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new BadRequestException("invalid email or password");

    const accessToken = await this.generateJWT({ id: user.id, userType: user.userType })

    return { accessToken };
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
      user.password = await this.hashPassword(password);
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
   * Hassing password
   * @param password plain text password
   * @returns hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}