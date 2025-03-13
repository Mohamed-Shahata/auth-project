import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { AuthGuard } from "src/users/guards/auth.guard";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { JWTPayloadType } from "src/utils/types";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { AuthRolesGuard } from "src/users/guards/auth.roles.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { UserType } from "src/utils/enum";
import { UpdateReviewDto } from "./dtos/update-review.dto";

@Controller("/api/reviews")
export class ReviewsController {

  constructor(private readonly reviewsService: ReviewsService) { };

  // POST: ~/api/reviews/:productId
  @Post("/:productId")
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  public createNewReview(
    @Param("productId", ParseIntPipe) productId: number,
    @CurrentUser() payload: JWTPayloadType,
    @Body() body: CreateReviewDto
  ) {
    return this.reviewsService.create(productId, payload.id, body);
  };

  // GET: ~/api/reviews
  @Get()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public getAllReviews(@Query("pageNumber", ParseIntPipe) pageNumber: number) {
    return this.reviewsService.getAll(pageNumber);
  }

  // PUT: ~/api/reviews/:id
  @Put("/:id")
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  public updateReview(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() payload: JWTPayloadType,
    @Body() body: UpdateReviewDto
  ) {
    return this.reviewsService.update(id, payload.id, body);
  };

  // DELETE: ~/api/reviews/:id
  @Delete("/:id")
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  public deleteReview(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() payload: JWTPayloadType
  ) {
    return this.reviewsService.delete(id, payload);
  };


  // GET: ~/api/reviews
  @Get("/:id")
  public getSingleReview(@Param("id", ParseIntPipe) id: number) {
    return this.reviewsService.getOnBy(id);
  }
}