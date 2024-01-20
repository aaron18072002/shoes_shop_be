import { Customers } from '../entities';
import { IsUnique } from '../validators/IsUniqueValidator';

export class UpdateCustomersDTO {
    @IsUnique(Customers, 'phone_number')
    phone_number: string;
}
