import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ReviewsService {

  constructor(
    @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService
  ) { };

  public getAll() {
    return [
      { id: 1, rating: 4, comment: "good" },
      { id: 2, rating: 2, comment: "good maybe" },
      { id: 3, rating: 1, comment: "not good" },
    ]
  }
}