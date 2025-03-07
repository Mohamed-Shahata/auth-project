import { Controller, Get } from "@nestjs/common";

@Controller("/api/reviews")
export class ReviewsController {

  @Get()
  public getAllReviews() {
    return [
      { id: 1, text: "text1" },
      { id: 2, text: "text2" },
      { id: 3, text: "text3" },
      { id: 4, text: "text4" }
    ]
  }
}