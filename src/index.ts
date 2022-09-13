import { AvailableSubs } from './enums';
import { FrixySubs, OkamiSubs, MioroSubs, MaouSubs, DayidSub, NanaSubs, Fumetsu } from './modules';

export interface IScopeAnime {
  anime: string;
  episode: string;
  website: AvailableSubs;
}

const scopeAnime = ({ anime, episode, website }: IScopeAnime) => {
  let data;
  switch (website) {
    /*case 'frixysubs':
        data = FrixySubs(anime, episode);
        break;*/
    case AvailableSubs.OkamiSubs:
      data = OkamiSubs(anime, episode);
      break;
    case AvailableSubs.MioroSubs:
      data = MioroSubs(anime, episode);
      break;
    case AvailableSubs.MaouSubs:
      data = MaouSubs(episode);
      break;
    case AvailableSubs.DayidSub:
      data = DayidSub(anime, episode);
      break;
    case AvailableSubs.NanaSubs:
      data = NanaSubs(anime, episode);
      break;
    case AvailableSubs.FumetsuSubs:
      data = Fumetsu(anime, episode);
      break;
    default:
      data = {
        status: 404,
        message: 'Not found group',
      };
  }

  return data;
};
export default scopeAnime;
