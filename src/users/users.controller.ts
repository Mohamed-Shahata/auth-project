import { Controller, Get } from "@nestjs/common";

@Controller("/api/users")
export class UsersController {

  @Get()
  public getAllUsers() {
    return [
      { id: 1, name: "mohamed", password: "123456" },
      { id: 2, name: "mahmoud", password: "58768787" },
      { id: 3, name: "ahmed", password: "123875875456" },
      { id: 4, name: "saif", password: "415487" }
    ]
  }
}