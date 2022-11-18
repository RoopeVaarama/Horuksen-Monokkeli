import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt.interface';
import { LoginDto } from '../user/user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    async login(data: LoginDto): Promise<any | { status: number }> {
        let user: User;
        try {
            user = await this.validateUser(data);
        } catch (error) {
            throw new HttpException(
                { description: 'Invalid username/password', error: error },
                HttpStatus.BAD_REQUEST
            );
        }
        if (user) {
            //Valid user
            const sessionExpiry = "168h"; //https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
            //@ts-ignore
            const payload = { username: data.username, id: user._id };
            const accessToken = this.jwtService.sign(
                payload,
                { expiresIn: sessionExpiry });

            return {
                expires_in: sessionExpiry,
                token: accessToken,
                user: user,
                status: HttpStatus.OK
            }
        }
        return
  }

  async validateToken(token: string): Promise<any> {
    //console.log(`auth.service _ token val: ${token}`)
    return await this.jwtService.verifyAsync(token);
  }

  async validateUser(data: LoginDto): Promise<any> {
    const { username, password } = data;

    const user = await this.userService.findValidateByUsername(username);
    if (!(await this.userService.validatePassword(user, password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validate(payload: JwtPayload): Promise<any> {
    //console.log(`auth.service _ payload val: ${payload.username}`)
    // Validate if token passed along with HTTP request
    // is associated with any registered account in the database
    //console.log(payload);
    return await this.userService.findValidateByUsername(payload.username);
  }
}
