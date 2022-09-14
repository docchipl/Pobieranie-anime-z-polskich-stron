import { AvailableSubs } from './enums';
import { AnimeSubsApiResponse } from './interfaces';
import { FrixySubs, OkamiSubs, MioroSubs, MaouSubs, DayidSub, NanaSubs, Fumetsu, DocchiSubs } from './modules';

export interface IScopeAnime {
  anime: string;
  episode: string;
  website: AvailableSubs;
}

const scopeAnime = async ({ anime, episode, website }: IScopeAnime): Promise<AnimeSubsApiResponse> => {
  let data;
  switch (website) {
    case AvailableSubs.FrixySubs:
      data = await FrixySubs(anime, episode);
      break;
    case AvailableSubs.DocchiSubs:
      data = await DocchiSubs(anime, episode);
      break;
    case AvailableSubs.OkamiSubs:
      data = await OkamiSubs(anime, episode);
      break;
    case AvailableSubs.MioroSubs:
      data = await MioroSubs(anime, episode);
      break;
    case AvailableSubs.MaouSubs:
      data = await MaouSubs(episode);
      break;
    case AvailableSubs.DayidSub:
      data = await DayidSub(anime, episode);
      break;
    case AvailableSubs.NanaSubs:
      data = await NanaSubs(anime, episode);
      break;
    case AvailableSubs.FumetsuSubs:
      data = await Fumetsu(anime, episode);
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
