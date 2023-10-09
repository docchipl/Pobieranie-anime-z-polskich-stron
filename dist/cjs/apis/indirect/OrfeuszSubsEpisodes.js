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
function OrfeuszSubsEpisodes(anime, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.orfeusz-subs.pl/api/episode/list?id=${anime}`, {
                headers: {
                    Accept: `application/json`,
                },
            });
            if (response.data.length <= 0) {
                return {
                    status: 500,
                };
            }
            const indexOfObject = response.data.findIndex((object) => {
                return object.number === Number(episode);
            });
            if (indexOfObject === -1) {
                return {
                    status: 500,
                };
            }
            return {
                status: 200,
                episode_id: response.data[indexOfObject].id,
                bg: null
            };
        }
        catch (error) {
            return {
                status: 500,
            };
        }
    });
}
exports.default = OrfeuszSubsEpisodes;
