import { GameService } from '@/modules/game/service/game.service';
import { gameRepository } from '@/modules/game/repository/game.repository';
import { createGameRoute } from '@/modules/game/route/game.route';
import { GameFacade } from '@/modules/game/facade/game.facade';

const gameService = new GameService(gameRepository);
const gameFacade = new GameFacade(gameService);
const gameRoute = createGameRoute(gameService);

export { gameRoute, gameFacade };
