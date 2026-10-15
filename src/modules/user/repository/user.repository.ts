import { AppDataSource } from '@/dataSource';
import { User } from '@/modules/user/domain/user.entity';
import { withTransaction } from '@/shared/repositories/withTransaction';

export const userRepository = withTransaction(AppDataSource.getRepository(User));
