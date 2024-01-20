import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '~/databse/data-source';
import { Customers } from '../entities';
import { UpdateCustomersDTO } from '../dtos/CustomersDTO';
import { validate } from 'class-validator';

export class CustomersController {
    async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const customerData = req.body;
            const customer = await AppDataSource.getRepository(Customers).save(customerData);
            if (!customer) {
                return res.status(400).json({
                    msg: 'An unexpected error occurred',
                });
            }
            return res.status(200).json({
                msg: 'Create customer sucessfully',
                data: customer,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCustomerByUserId(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { id } = req.params;
            const customer = await AppDataSource.getRepository(Customers).findOneBy({
                user_id: id,
            });
            if (!customer) {
                return res.status(200).json({
                    msg: 'Cant not find this user',
                });
            }
            return res.status(200).json({
                msg: 'Get an customer sucessfully',
                data: customer,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateCustomerByUserId(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            let updateCustomerData = req.body;
            const { user_id } = req.params;

            const updateCustomerDTO = new UpdateCustomersDTO();
            updateCustomerDTO.phone_number = updateCustomerData.phone_number;

            const errors = await validate(updateCustomerDTO);
            if (errors && errors.length > 0) {
                return res.status(422).json({
                    msg: 'This phone number has already used',
                    err: errors,
                });
            }

            const customer = await AppDataSource.getRepository(Customers).findOneBy({
                user_id,
            });
            if (!customer) {
                return res.status(200).json({
                    msg: 'Cant not find this user',
                });
            }

            await AppDataSource.getRepository(Customers)
                .createQueryBuilder('customers')
                .update(Customers)
                .set({
                    name: updateCustomerData.name,
                    address: updateCustomerData.address,
                    city: updateCustomerData.city,
                    country: updateCustomerData.country,
                    phone_number: updateCustomerData.phone_number,
                })
                .where('user_id = :user_id', { user_id })
                .execute();

            return res.status(200).json({
                msg: 'Update an customer sucessfully',
                data: customer,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}
