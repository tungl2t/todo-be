import { BaseEntity } from '../entities/base.entity';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

export abstract class BaseService<T extends BaseEntity> {
  protected repository: Repository<T>;

  async findBy(filter: {}): Promise<Array<T>> {
    return this.repository.findBy(filter);
  }

  async findOneBy(filter: {}): Promise<T|null> {
    return this.repository.findOneBy(filter);
  }


  /**
   * For using hook purpose, should use this function before creating persistent data
   * @param entity
   */
  async create(entity: DeepPartial<T>): Promise<T> {
    return this.repository.create(entity);
  }

  async save(entity: DeepPartial<T> | any): Promise<T> {
    return this.repository.save(entity);
  }

}
