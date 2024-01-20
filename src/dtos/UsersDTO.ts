import { IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Genders } from '../constants/Genders';

export class UpdateUsersDTO {
    @IsNotEmpty({
        message: 'Name is required',
    })
    @MinLength(3, {
        message: 'Name is too short',
    })
    @MaxLength(30, {
        message: 'Name is less than 30 characters',
    })
    name: string;

    // gender
    @IsNotEmpty({
        message: 'Please select your gender',
    })
    @IsEnum(Genders)
    gender: string;
}
