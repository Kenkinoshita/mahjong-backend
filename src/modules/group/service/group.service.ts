import { Transactional } from '@/decorators/transactional';
import { Repository } from 'typeorm';
import { Group } from '@/modules/group/domain/group.entity';
import { GetGroupInputDto, GetGroupOutputDto } from '@/modules/group/service/dto/getGroup.dto';

export class GroupService {
  constructor(private readonly groupRepository: Repository<Group>) {}

  @Transactional()
  async getGroup({ groupId }: GetGroupInputDto): Promise<GetGroupOutputDto> {
    console.log('Fetching group with ID:', groupId);
    const group = await this.groupRepository.findOneBy({ id: Number(groupId) });
    if (!group) {
      throw new Error('Group not found');
    }
    return {
      id: group.id,
      name: group.name,
      memberIds: group.memberIds,
    };
  }
}
