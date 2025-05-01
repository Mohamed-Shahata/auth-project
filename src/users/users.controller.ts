import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import { Response } from "express";
import { join } from "path";
import { existsSync } from "fs";


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

  // GET: ~/api/users/images/:image
  @Get("/images/:image")
  @UseGuards(AuthGuard)
  public showProfileImage(@Param("image") image: string, @Res() res: Response) {

    const imagePath = join("images/users", image);
    if (!existsSync(imagePath)) {
      throw new NotFoundException("Image not found");
    }
    return res.sendFile(image, { root: "images/users" });
  }

  // GET: ~/api/users/verify-email/:id/:verificationToken
  @Get("/verify-email/:id/:verificationToken")
  public verifyEmail(
    @Param("id", ParseIntPipe) id: number,
    @Param("verificationToken") verificationToken: string
  ) {
    return this.userService.verifyEmail(id, verificationToken);
  };
};