import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { ProductsService } from "src/products/products.service";
import { UsersService } from "src/users/users.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { JWTPayloadType } from "src/utils/types";
import { UserType } from "src/utils/enum";
import { UpdateReviewDto } from "./dtos/update-review.dto";

@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    private readonly productService: ProductsService,
    private readonly userService: UsersService
  ) { };


  /**
   * Create new review
   * @param productId id of the product
   * @param userId id of the user that created this review
   * @param dto data for creating new review
   * @returns the created review ftom the database
   */
  public async create(productId: number, userId: number, dto: CreateReviewDto) {
    const product = await this.productService.getOneBy(productId);
    const user = await this.userService.getCurrentUser(userId);

    const review = this.reviewRepository.create({ ...dto, product, user });
    const result = await this.reviewRepository.save(review);

    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      createdAt: result.createdAt,
      userId: user.id,
      productId: product.id
    }
  };

  /**
   * Get all Reviews
   * @returns collection of reviews
   */
  public getAll() {
    return this.reviewRepository.find({ order: { createdAt: "DESC" } });
  }

  /**
   * Get review one by id
   * @param id id of the review
   * @returns get single review from the databse
   */
  public async getOnBy(id: number) {
    return this.getReviewBy(id);
  }

  /**
   * Update review
   * @param reviewId id of the review
   * @param userId id of the owner of the review
   * @param dto data for updating the review
   * @returns updated review
   */
  public async update(reviewId: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.getReviewBy(reviewId);

    if (review.user.id !== userId)
      throw new ForbiddenException("access denied, you are not allowed");

    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;
    return this.reviewRepository.save(review);
  }

  /**
   * Delete review
   * @param reviewId id of the review
   * @param payload JWTPayload
   * @returns a success message
   */
  public async delete(reviewId: number, payload: JWTPayloadType) {
    const review = await this.getReviewBy(reviewId);

    if (review.user.id === payload.id || payload.userType === UserType.ADMIN) {
      await this.reviewRepository.remove(review);
      return { message: "Review has been deleted" }
    }

    throw new ForbiddenException("you are not allowed");
  }


  /**
   * Get single review by id
   * @param id id of the review
   * @returns review from the database
   */
  private async getReviewBy(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException("Review not found");
    return review;
  }

}