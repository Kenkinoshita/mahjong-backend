import type { GameService } from '@/modules/game/service/game.service';

export class GameFacade {
  constructor(private readonly gameService: GameService) {}
}
