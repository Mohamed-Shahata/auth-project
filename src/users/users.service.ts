import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenType, JWTPayloadType } from "src/utils/types";


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
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

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

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
   * Generate Json Web Token
   * @param payload JWT Payload
   * @returns Token
   */
  private generateJWT(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}