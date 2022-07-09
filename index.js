import {FrixySubs, OkamiSubs, MioroSubs, MaouSubs, DayidSub, NanaSubs, Fumetsu} from "./modules/index.js";

function scopeAnime({anime, episode, website}){

    let data;
    switch (website) {
      case 'frixysubs':
        data = FrixySubs(anime, episode);
        break;
      case 'okamisubs':
        data = OkamiSubs(anime, episode);
        break;
      case 'miorosubs':
        data = MioroSubs(anime, episode);
        break;
      case 'maousubs':
        data = MaouSubs(episode);
        break;
      case 'dayidsub':
        data = DayidSub(anime, episode);
        break;
      case 'nanasubs':
        data = NanaSubs(anime, episode);
        break;
      case 'fumetsu':
        data = Fumetsu(anime, episode);
        break;
      default:
        data = {
          status: 404,
          message: 'Not found group'
        }
    }

    return(data);

}
export default scopeAnime;
