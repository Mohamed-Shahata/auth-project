import { Module } from "@nestjs/common";
import { UserController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthProviders } from "./providers/auth.provider";

@Module({
  controllers: [UserController],
  providers: [UsersService, AuthProviders],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>("JWT_SECRET"),
          signOptions: { expiresIn: config.get<string>("JWT_EXPIRES_IN") }
        }
      }
    })
  ]
})
export class UsersModule { };