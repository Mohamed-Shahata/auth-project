import { Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { UsersModule } from "src/users/users.module";
import { ProductModule } from "src/products/products.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [TypeOrmModule.forFeature([Review]), UsersModule, ProductModule, JwtModule]
})
export class ReviewsModule {

}