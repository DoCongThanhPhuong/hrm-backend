import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import { PaginationParams, PaginationResult } from '../interfaces';

export class TypeORMRepository<T extends ObjectLiteral> extends Repository<T> {
  async list(query: PaginationParams<T>): Promise<PaginationResult<T>> {
    const { size = 10, page = 1 } = query;

    const queryBuilder = this._prepareQuery(query);

    const [data, count] = await queryBuilder
      .limit(size || 10)
      .offset((page - 1) * size || 0)
      .getManyAndCount();

    return {
      data,
      count,
      currentPage: page,
      totalPage: Math.ceil(count / size),
    };
  }

  async listWithRawQuery(
    query: PaginationParams<T>,
  ): Promise<PaginationResult<T>> {
    const { size = 10, page = 1 } = query;

    const queryBuilder = this._prepareQuery(query);

    const [data, count] = await Promise.all([
      queryBuilder
        .limit(size || 10)
        .offset((page - 1) * size || 0)
        .getRawMany(),
      queryBuilder.getCount(),
    ]);

    return {
      data,
      count,
      currentPage: page,
      totalPage: Math.ceil(count / size),
    };
  }

  private _prepareQuery(query: PaginationParams<T>): SelectQueryBuilder<T> {
    let queryBuilder = query.queryBuilder;

    if (!queryBuilder) {
      queryBuilder = this.createQueryBuilder('document').orderBy(
        'document.createdAt',
        'ASC',
      );
    }

    return queryBuilder;
  }
}
