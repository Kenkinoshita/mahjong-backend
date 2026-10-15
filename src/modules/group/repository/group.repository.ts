import { AppDataSource } from '@/dataSource';
import { Group } from '@/modules/group/domain/group.entity';
import { withTransaction } from '@/shared/repositories/withTransaction';

export const groupRepository = withTransaction(AppDataSource.getRepository(Group));
