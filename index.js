import {FrixySubs, OkamiSubs, MioroSubs, MaouSubs, DayidSub, NanaSubs, Fumetsu, DocchiSubs, Wbijam, Desuonline, CDA} from "./modules/index.js";

function scopeAnime({anime, episode, website, user, folder, type, spaces}){

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
      case 'docchi':
      case 'docchisubs':
        data = DocchiSubs(anime, episode);
        break;
      case 'wbijam':
        data = Wbijam(anime, episode);
        break;
      case 'desuonline':
        data = Desuonline(anime, episode);
        break;
      case 'cda':
        data = CDA(user, folder, type, spaces, episode);
        break;
      default:
        data = {
          status: 404,
          message: 'Group not found'
        }
    }

    return(data);

}
export default scopeAnime;
