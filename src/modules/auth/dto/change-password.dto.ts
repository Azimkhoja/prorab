import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import {IsEqualTo} from "../../../common/decorators/is-equal-to.decorator";
import {ApiProperty} from "@nestjs/swagger";

/**
 * change password data transfer object
 */
export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(4, {
    message: 'minLength-{"ln":4,"count":4}'
  })
  @MaxLength(15, {
    message: 'maxLength-{"ln":15,"count":15}'
  })
  
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsEqualTo('password', {
    message: 'isEqualTo-{"field":"password"}'
  })
  @ApiProperty()
  confirmPassword: string;
}