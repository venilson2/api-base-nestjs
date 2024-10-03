import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}
  
  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findAll() {
    return this.userModel.findAll();
  }

  findOne(id: string) {
    return this.userModel.findOne({where: {id}});
  }

  findEmail(email: string) {
    return this.userModel.findOne({where: {email}});
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.update(updateUserDto, {
      where: { id } ,
      returning: true
    });
  }

  remove(id: string) {
    return this.userModel.destroy({ where: { id } });
  }

  updateRefreshToken(id: string, refreshToken: string) {
    this.userModel.update(
      { refreshToken },
      { where: { id } }
    );
  }

  findByRefreshToken(refreshToken: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ where: { refreshToken } });
  }
}
