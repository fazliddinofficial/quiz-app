import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./entity";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly UserModel: Model<User>) { }
  async createUser({ fullName }: CreateUserDto) {
    const createdUser = await this.UserModel.create({ fullName });

  }
}