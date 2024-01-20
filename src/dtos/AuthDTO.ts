import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength, IsEnum } from 'class-validator';
import { IsUnique } from '../validators/IsUniqueValidator';
import { Users } from '../entities';
import { Genders } from '../constants/Genders';

export class RegisterDTO {
    // name
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

    // email
    @IsNotEmpty({
        message: 'This is incorrect format of an email',
    })
    @IsEmail()
    @IsUnique(Users, 'email')
    email: string;

    // password
    @IsNotEmpty({
        message: 'Password is required',
    })
    @MinLength(8, {
        message: 'Your password must be at least 8 characters',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
            'Your password must be at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    password: string;

    // gender
    @IsNotEmpty({
        message: 'Please select your gender',
    })
    @IsEnum(Genders)
    gender: string;

    // date of birth
}

export class LoginDTO {
    @IsNotEmpty({
        message: 'Please enter your email address',
    })
    @IsEmail()
    email: string;

    @IsNotEmpty({
        message: 'Password is required',
    })
    @MinLength(8, {
        message: 'Your password must be at least 8 characters',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
            'Your password must be at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    password: string;
}
