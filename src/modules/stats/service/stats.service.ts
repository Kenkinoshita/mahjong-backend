import { Transactional } from '@/shared/decorators/transactional';
import type { UserFacade } from '@/modules/user/facade/user.facade';
import type { GameFacade } from '@/modules/game/facade/game.facade';
import type {
  GetOverallStatsOutputDto,
  GetStatsInputDto,
  GetStatsOutputDto,
} from '@/modules/stats/service/dto/getStats.dto';
import { sleep } from '@/shared/utils/sleep';

export class StatsService {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly gameFacade: GameFacade,
  ) {}

  //Sample
  @Transactional()
  // eslint-disable-next-line @typescript-eslint/require-await
  async getStatistics(input: GetStatsInputDto): Promise<GetStatsOutputDto> {
    console.log('Fetching statistics with input:', input);
    // 今は単純に gameFacade は使わず統計値を返すが、拡張時にはここで gameFacade を使って集計できます
    return {
      rank: 1,
      name: '',
      point: 0,
      gameCount: 0,
      averageRank: 0,
      topRate: 0,
      avoidLastRate: 0,
      rentaiRate: 0,
    };
  }

  async getOverallStats(): Promise<GetOverallStatsOutputDto> {
    await sleep(1); // データベースクエリや集計処理のシミュレーションのために1秒待機
    return [
      {
        rank: 1,
        name: '木下',
        point: 12.2,
        gameCount: 12,
        averageRank: 2.5,
        topRate: 25,
        avoidLastRate: 25,
        rentaiRate: 50,
      },
      {
        rank: 2,
        name: '須川',
        point: -12.2,
        gameCount: 13,
        averageRank: 2.5,
        topRate: 25,
        avoidLastRate: 25,
        rentaiRate: 50,
      },
      {
        rank: 3,
        name: '星野',
        point: 0,
        gameCount: 13,
        averageRank: 2.5,
        topRate: 25,
        avoidLastRate: 25,
        rentaiRate: 50,
      },
    ];
  }
}
