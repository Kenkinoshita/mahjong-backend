import { Transactional } from '@/decorators/transactional';
import { Repository } from 'typeorm';
import { Game } from '@/modules/game/domain/game.entity';
import { GetGameInputDto, GetGameOutputDto } from '@/modules/game/service/dto/getGame.dto';

export class GameService {
  constructor(private readonly gameRepository: Repository<Game>) {}

  @Transactional()
  async getGame({ gameId }: GetGameInputDto): Promise<GetGameOutputDto> {
    console.log('Fetching game with ID:', gameId);
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new Error('Game not found');
    }
    const { id, groupId, scores } = game;
    return { id, groupId, scores };
  }
}
