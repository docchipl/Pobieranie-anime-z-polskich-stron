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
const OrfeuszSubsEpisodes_js_1 = __importDefault(require("./indirect/OrfeuszSubsEpisodes.js"));
const OrfeuszSubsPlayers_js_1 = __importDefault(require("./indirect/OrfeuszSubsPlayers.js"));
function OrfeuszSubs(anime, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        const episodeID = yield (0, OrfeuszSubsEpisodes_js_1.default)(anime, episode);
        if (episodeID.status !== 200 || !episodeID.episode_id) {
            return {
                status: 500,
                message: "Something went wrong!",
            };
        }
        const orfeusz = yield (0, OrfeuszSubsPlayers_js_1.default)(episode, episodeID.episode_id, episodeID.bg);
        return orfeusz;
    });
}
exports.default = OrfeuszSubs;
