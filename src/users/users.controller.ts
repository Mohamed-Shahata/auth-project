import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { JWTPayloadType } from "src/utils/types";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Roles } from "./decorators/user-role.decorator";
import { UserType } from "src/utils/enum";
import { AuthRolesGuard } from "./guards/auth.roles.guard";
import { UpdateUserDto } from "./dtos/update-user.dto";


@Controller("/api/users")
export class UserController {

  constructor(private readonly userService: UsersService) { };

  // POST: ~/api/users/auth/register
  @Post("/auth/register")
  public register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }

  // POST: ~/api/users/auth/login
  @Post("/auth/login")
  @HttpCode(HttpStatus.OK)
  public login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  // GET: ~/api/users/current-user
  @Get("/current-user")
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    return this.userService.getCurrentUser(payload.id);
  }

  // GET: ~/api/users
  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public getAllUsers() {
    return this.userService.getAll()
  }

  // PUT: ~/api/users
  @Put()
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  public updateUser(@CurrentUser() payload: JWTPayloadType, @Body() body: UpdateUserDto) {
    return this.userService.update(payload.id, body)
  }

  // DELETE: ~/api/users
  @Delete("/:id")
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  public deleteUser(@Param("id", ParseIntPipe) id: number, @CurrentUser() payload: JWTPayloadType) {
    return this.userService.delete(id, payload);
  }
}