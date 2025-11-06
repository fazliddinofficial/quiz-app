import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelDef } from './entity';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([UserModelDef])],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
