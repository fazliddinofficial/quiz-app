import * as jwt from 'jsonwebtoken';
import { HandlersKeys, JwtPayload } from './types';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { config } from './config';
import { PERMISSIONS } from './permission';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const action = context.getHandler().name as HandlersKeys;

    if (PERMISSIONS.whiteList.has(action)) {
      request['userPhone'] = request.body.phoneNumber;
      return true;
    }

    let token: any;
    try {
      const authHeader = request.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1];
    } catch (_) {
      throw new NotFoundException('Token not found!');
    }
    jwt.verify(token, config.JWT_SECRET_KEY, (err: any) => {
      if (err) {
        throw new UnauthorizedException(`Token is invalid! ${err}`);
      }
    });

    const user: JwtPayload = jwt.decode(token) as unknown as JwtPayload;

    if (!user) {
      throw new Error('User not found!');
    }

    if (PERMISSIONS[user['role']].has(action)) {
      request['userId'] = user.userId;
      return true;
    }

    throw new BadRequestException('You have no permission for this operation');
  }
}

export const UseAuthGuard = () => UseGuards(AuthGuard);
