import { hashSync } from 'bcrypt';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { UserEntity } from '../entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo() {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    if (event.entity.email) {
      event.entity.email = event.entity.email.toLowerCase();
    }

    if (event.entity.password) {
      event.entity.password = hashSync(event.entity.password, 10);
      event.entity.lastUpdatePasswordAt = new Date();
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    const entity = event.entity as UserEntity;

    if (entity.email) {
      entity.email = entity.email.toLowerCase();
    }

    if (entity.password) {
      entity.password = hashSync(entity.password, 10);
      event.entity.lastUpdatePasswordAt = new Date();
    }
  }
}
