import { Request } from 'express';

interface PaginationInfo {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export class Paginator {
    static async paginate(queryBuilder: any, req: Request) {
        let page = Number(req.query.page) || 1;
        let pageSize = Number(req.query.pageSize) || 12;
        const offset = (page - 1) * pageSize;

        const records = await queryBuilder.skip(offset).take(pageSize).getMany();
        const totalItems = await queryBuilder.getCount();

        const pages = Math.ceil(totalItems / pageSize);
        const currentPage = offset / pageSize + 1;
        const hasNext = currentPage < pages;
        const hasPrev = currentPage > 1;

        const paginationInfo: PaginationInfo = {
            currentPage: page,
            pageSize,
            totalItems,
            pages,
            hasNext,
            hasPrev,
        };

        return { records, paginationInfo };
    }
}
