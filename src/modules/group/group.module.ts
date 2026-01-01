import { GroupService } from '@/modules/group/service/group.service';
import { groupRepository } from '@/modules/group/repository/group.repository';
import { createGroupRoute } from '@/modules/group/route/group.route';

const groupService = new GroupService(groupRepository);
const groupRoute = createGroupRoute(groupService);

export { groupRoute };
