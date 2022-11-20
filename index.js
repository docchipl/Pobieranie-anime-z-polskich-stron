import {OkamiSubs, DayidSub, NanaSubs, Fumetsu, Wbijam, CDA, Kathsubs, Grupamirai, Reikoproject} from "./modules/index.js";
import {FrixySubs, DocchiSubs, MaouSubs} from "./modules/api/index.js";
import {Desuonline, MioroSubs} from "./modules/wordpress/index.js";

function scopeAnime({anime, episode, website, user, folder, type, spaces}){

    let data;
    switch (website) {
      case 'frixysubs':
      case 'frixy':
        data = FrixySubs(anime, episode);
        break;
      case 'okamisubs':
      case 'okami':
        data = OkamiSubs(anime, episode);
        break;
      case 'miorosubs':
      case 'mioro':
        data = MioroSubs(anime, episode);
        break;
      case 'maousubs':
      case 'maou':
        data = MaouSubs(anime, episode);
        break;
      case 'dayidsub':
      case 'dayid':
        data = DayidSub(anime, episode);
        break;
      case 'nanasubs':
      case 'nana':
        data = NanaSubs(anime, episode);
        break;
      case 'fumetsu':
        data = Fumetsu(anime, episode);
        break;
      case 'docchisubs':
      case 'docchi':
        data = DocchiSubs(anime, episode);
        break;
      case 'wbijam':
        data = Wbijam(anime, episode);
        break;
      case 'desuonline':
      case 'desu':
        data = Desuonline(anime, episode);
        break;
      case 'cda':
        data = CDA(user, folder, type, spaces, episode);
        break;
      case 'kathsubs':
        data = Kathsubs(anime, episode);
        break;
      case 'grupamirai':
      case 'mirai':
        data = Grupamirai(anime, episode);
        break;
      case 'reikoproject':
      case 'reiko':
        data = Reikoproject(anime, episode);
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