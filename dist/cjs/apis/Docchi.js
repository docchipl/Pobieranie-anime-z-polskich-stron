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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function Docchi(anime, episode) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.docchi.pl/v1/episodes/find/${anime}/${episode}`, {
                headers: {
                    Accept: `application/json`,
                },
            });
            if (response.data.length <= 0) {
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            }
            return {
                status: 200,
                message: "Mission Accomplished!",
                episode_thumbnail: (_a = response.data[0].bg) !== null && _a !== void 0 ? _a : null,
                episodes: response.data.map(function (x) {
                    return {
                        player: x.player_hosting,
                        url: x.player,
                    };
                }),
                episode_next_url: Number(episode) + 1,
            };
        }
        catch (error) {
            return {
                status: 500,
                message: "Something went wrong!",
            };
        }
    });
}
exports.default = Docchi;
