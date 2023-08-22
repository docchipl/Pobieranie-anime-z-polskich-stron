import { ServiceCDAFolder, ServiceCDAProfile } from "./services/CDA/index.js";
import { DocchiAPI, FrixySubsAPI, OrfeuszSubsAPI } from "./apis/index.js";
import { ServiceJuniorSubs, ServiceMakiSubs, ServiceMioroSubs, ServicePaldea, } from "./services/wordpress/index.js";
import { ServiceFumetsu, ServiceGrupaMirai, ServiceKathSubs, ServiceNanaSubs, ServiceOkamiSubs, ServiceReikoProject, ServiceWbijam, } from "./services/index.js";
export default async function runScript({ anime, episode, website, user, folder, type, spaces, keyword, }) {
    if (!website) {
        return {
            status: 404,
            message: "Unsupported service.",
        };
    }
    if (user) {
        switch (website) {
            case "cda-folder":
            case "cda": {
                if (!folder || !type || !spaces) {
                    return {
                        status: 400,
                        message: "Missing parameters: folder, type, or spaces.",
                    };
                }
                return await ServiceCDAFolder(user, folder, type, spaces, episode);
            }
            case "cda-profile":
            case "cdaprofile": {
                if (!keyword || !type || !spaces) {
                    return {
                        status: 400,
                        message: "Missing parameters: folder, type, or spaces.",
                    };
                }
                return await ServiceCDAProfile(user, keyword, type, spaces, episode);
            }
            default:
                return {
                    status: 404,
                    message: "Group not found.",
                };
        }
    }
    if (!anime) {
        return {
            status: 400,
            message: "Missing parameters: anime.",
        };
    }
    switch (website) {
        case "frixysubs":
        case "frixy": {
            return await FrixySubsAPI(anime, episode);
        }
        case "docchisubs":
        case "docchi":
        case "docci": {
            return await DocchiAPI(anime, episode);
        }
        case "orfeuszsubs":
        case "orfeusz": {
            return await OrfeuszSubsAPI(anime, episode);
        }
        case "miorosubs":
        case "mioro": {
            return await ServiceMioroSubs(anime, episode);
        }
        case "makisubs":
        case "maki": {
            return await ServiceMakiSubs(anime, episode);
        }
        case "paldea": {
            return await ServicePaldea(episode);
        }
        // case "desuonline":
        // case "desu": {
        //   return await ServiceDesuOnline(anime, episode);
        // }
        case "juniorsubs":
        case "junior": {
            if (!folder) {
                return {
                    status: 400,
                    message: "Missing parameters: folder.",
                };
            }
            return await ServiceJuniorSubs(folder, anime, episode);
        }
        case "fumetsu": {
            return await ServiceFumetsu(anime, episode);
        }
        case "kath":
        case "kathsubs": {
            return await ServiceKathSubs(anime, episode);
        }
        case "reikoproject":
        case "reiko": {
            return await ServiceReikoProject(anime, episode);
        }
        case "grupamirai":
        case "mirai": {
            return await ServiceGrupaMirai(anime, episode);
        }
        case "nanasubs":
        case "nana": {
            return await ServiceNanaSubs(anime, episode);
        }
        case "okamisubs":
        case "okami": {
            return await ServiceOkamiSubs(anime, episode);
        }
        case "wbijam":
        case "tmj": {
            return await ServiceWbijam(anime, episode);
        }
        default:
            return {
                status: 404,
                message: "Group not found.",
            };
    }
}
