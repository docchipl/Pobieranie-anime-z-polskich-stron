"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./services/CDA/index.js");
const index_js_2 = require("./apis/index.js");
const index_js_3 = require("./services/wordpress/index.js");
const index_js_4 = require("./services/index.js");
function runScript({ anime, episode, website, user, folder, type, spaces, keyword, }) {
    return __awaiter(this, void 0, void 0, function* () {
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
                    return yield (0, index_js_1.ServiceCDAFolder)(user, folder, type, spaces, episode);
                }
                case "cda-profile":
                case "cdaprofile": {
                    if (!keyword || !type || !spaces) {
                        return {
                            status: 400,
                            message: "Missing parameters: folder, type, or spaces.",
                        };
                    }
                    return yield (0, index_js_1.ServiceCDAProfile)(user, keyword, type, spaces, episode);
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
                return yield (0, index_js_2.FrixySubsAPI)(anime, episode);
            }
            case "docchisubs":
            case "docchi":
            case "docci": {
                return yield (0, index_js_2.DocchiAPI)(anime, episode);
            }
            case "orfeuszsubs":
            case "orfeusz": {
                return yield (0, index_js_2.OrfeuszSubsAPI)(anime, episode);
            }
            case "miorosubs":
            case "mioro": {
                return yield (0, index_js_3.ServiceMioroSubs)(anime, episode);
            }
            case "makisubs":
            case "maki": {
                return yield (0, index_js_3.ServiceMakiSubs)(anime, episode);
            }
            case "paldea": {
                return yield (0, index_js_3.ServicePaldea)(episode);
            }
            case "desuonline":
            case "desu": {
                return yield (0, index_js_3.ServiceDesuOnline)(anime, episode);
            }
            case "juniorsubs":
            case "junior": {
                if (!folder) {
                    return {
                        status: 400,
                        message: "Missing parameters: folder.",
                    };
                }
                return yield (0, index_js_3.ServiceJuniorSubs)(folder, anime, episode);
            }
            case "fumetsu": {
                return yield (0, index_js_4.ServiceFumetsu)(anime, episode);
            }
            case "kath":
            case "kathsubs": {
                return yield (0, index_js_4.ServiceKathSubs)(anime, episode);
            }
            case "reikoproject":
            case "reiko": {
                return yield (0, index_js_4.ServiceReikoProject)(anime, episode);
            }
            case "grupamirai":
            case "mirai": {
                return yield (0, index_js_4.ServiceGrupaMirai)(anime, episode);
            }
            case "nanasubs":
            case "nana": {
                return yield (0, index_js_4.ServiceNanaSubs)(anime, episode);
            }
            case "okamisubs":
            case "okami": {
                return yield (0, index_js_4.ServiceOkamiSubs)(anime, episode);
            }
            case "wbijam":
            case "tmj": {
                return yield (0, index_js_4.ServiceWbijam)(anime, episode);
            }
            default:
                return {
                    status: 404,
                    message: "Group not found.",
                };
        }
    });
}
exports.default = runScript;
