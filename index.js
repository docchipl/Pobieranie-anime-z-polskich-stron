import {
  OkamiSubs,
  NanaSubs,
  Fumetsu,
  Wbijam,
  Kathsubs,
  Grupamirai,
  Reikoproject,
  OrfeuszSubs,
} from "./modules/index.js";
import { FrixySubsAPI, DocchiSubsAPI, MaouSubsAPI } from "./api/index.js";
import {
  Desuonline,
  MioroSubs,
  JuniorSubs,
  Paldea,
  MakiSubs,
} from "./modules/wordpress/index.js";
import { CDA, CDAProfile } from "./modules/cda/index.js";
import { Bitly } from "./shorteners/index.js";

export default function scrape({
  anime,
  episode,
  website,
  user,
  folder,
  type,
  spaces,
  keyword,
  url,
}) {
  switch (website) {
    case "frixysubs":
    case "frixy": {
      return FrixySubsAPI(anime, episode);
    }
    case "okamisubs":
    case "okami": {
      return OkamiSubs(anime, episode);
    }
    case "miorosubs":
    case "mioro": {
      return MioroSubs(anime, episode);
    }
    case "dragonsubs":
    case "dragon": {
      return MaouSubsAPI(anime, episode);
    }
    case "nanasubs":
    case "nana": {
      return NanaSubs(anime, episode);
    }
    case "fumetsu": {
      return Fumetsu(anime, episode);
    }
    case "docchisubs":
    case "docchi": {
      return DocchiSubsAPI(anime, episode);
    }
    case "wbijam": {
      return Wbijam(anime, episode);
    }
    case "desuonline":
    case "desu": {
      return Desuonline(anime, episode);
    }
    case "cda": {
      return CDA(user, folder, type, spaces, episode);
    }
    case "cdaprofile": {
      return CDAProfile(user, keyword, type, spaces, episode);
    }
    case "kathsubs": {
      return Kathsubs(anime, episode);
    }
    case "grupamirai":
    case "mirai": {
      return Grupamirai(anime, episode);
    }
    case "reikoproject":
    case "reiko": {
      return Reikoproject(anime, episode);
    }
    case "orfeuszsubs":
    case "orfeusz": {
      return OrfeuszSubs(anime, episode);
    }
    case "juniorsubs":
    case "junior": {
      return JuniorSubs(folder, anime, episode);
    }
    case "paldea": {
      return Paldea(episode);
    }
    case "makisubs":
    case "maki": {
      return MakiSubs(anime, episode);
    }
    case "bitly": {
      return Bitly(url);
    }
    default: {
      return {
        status: 404,
        message: "Group not found",
      };
    }
  }
}
