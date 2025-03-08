import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ReviewsService } from "src/reviews/reviews.service";


@Injectable()
export class UsersService {

  constructor(
    @Inject(forwardRef(() => ReviewsService)) private readonly reviewsService: ReviewsService
  ) { };

  public getAll() {
    return [
      { id: 1, name: "mohamed", passsword: "123" },
      { id: 2, name: "omer", passsword: "155" },
      { id: 3, name: "ahmed", passsword: "983" },
    ]
  }
}