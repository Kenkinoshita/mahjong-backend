import { Transactional } from '@/shared/decorators/transactional';
import { Repository } from 'typeorm';
import { Game } from '@/modules/game/domain/game.entity';
import { GetGameInputDto, GetGameOutputDto } from '@/modules/game/service/dto/getGame.dto';
import type { UserFacade } from '@/modules/user/facade/user.facade';
import { ApiError } from '@/shared/errors/apiError';

export class GameService {
  constructor(
    private readonly gameRepository: Repository<Game>,
    private readonly userFacade: UserFacade,
  ) {}

  @Transactional()
  async getGame({ gameId }: GetGameInputDto): Promise<GetGameOutputDto> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: { scores: true },
    });
    if (!game) throw ApiError.notFound('Game not found');

    return {
      id: game.id,
      groupId: game.groupId,
      scores: game.scores.map((score) => ({
        userId: score.userId,
        point: score.point,
      })),
    };
  }
}
