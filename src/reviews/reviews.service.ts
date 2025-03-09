import { Injectable } from "@nestjs/common";

@Injectable()
export class ReviewsService {

  constructor() { };

  public getAll() {
    return [
      { id: 1, rating: 4, comment: "good" },
      { id: 2, rating: 2, comment: "good maybe" },
      { id: 3, rating: 1, comment: "not good" },
    ]
  }
}