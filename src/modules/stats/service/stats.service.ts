import { Transactional } from '@/shared/decorators/transactional';
import type { UserFacade } from '@/modules/user/facade/user.facade';
import type { GameFacade } from '@/modules/game/facade/game.facade';
import type { GetStatsInputDto, GetStatsOutputDto } from '@/modules/stats/service/dto/getStats.dto';

export class StatsService {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly gameFacade: GameFacade,
  ) {}

  @Transactional()
  // eslint-disable-next-line @typescript-eslint/require-await
  async getStatistics(input: GetStatsInputDto): Promise<GetStatsOutputDto> {
    console.log('Fetching statistics with input:', input);
    // 今は単純に gameFacade は使わず統計値を返すが、拡張時にはここで gameFacade を使って集計できます
    return {
      gamesPlayed: 42,
      highestScore: 9001,
    };
  }
}
