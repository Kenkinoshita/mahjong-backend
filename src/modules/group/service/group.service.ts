import { Transactional } from '@/shared/decorators/transactional';
import { Repository } from 'typeorm';
import { Group } from '@/modules/group/domain/group.entity';
import { GetGroupInputDto, GetGroupOutputDto } from '@/modules/group/service/dto/getGroup.dto';
import { ApiError } from '@/shared/errors/apiError';

export class GroupService {
  constructor(private readonly groupRepository: Repository<Group>) {}

  @Transactional()
  async getGroup({ groupId }: GetGroupInputDto): Promise<GetGroupOutputDto> {
    const group = await this.groupRepository.findOneBy({ id: Number(groupId) });
    if (!group) throw ApiError.notFound('Group not found');

    return {
      id: group.id,
      name: group.name,
    };
  }
}
