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
const jsdom_1 = require("jsdom");
const CompileEpisodeData_js_1 = __importDefault(require("../utils/CompileEpisodeData.js"));
const virtualConsole = new jsdom_1.VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
function ServiceFumetsu(anime, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://fumetsu.pl/anime/${anime}/${episode}`, {
                headers: {
                    Referer: `https://fumetsu.pl/anime/${anime}/${episode}`,
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const dom = new jsdom_1.JSDOM(response.data, { virtualConsole });
            const items = dom.window.document.querySelectorAll(".video_cont iframe");
            let episodes_cleaning = [];
            if (!items) {
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            }
            yield Promise.all(Array.from(items).map(function (x) {
                return __awaiter(this, void 0, void 0, function* () {
                    const item = x;
                    const data = (0, CompileEpisodeData_js_1.default)(item.src);
                    if (!data.hosting || !data.player_embed) {
                        return;
                    }
                    episodes_cleaning.push({
                        player: data.hosting,
                        url: data.player_embed,
                    });
                });
            }));
            if (episodes_cleaning.length === 0) {
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            }
            return {
                status: 200,
                message: "Mission Accomplished!",
                episode_thumbnail: null,
                episodes: episodes_cleaning,
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
exports.default = ServiceFumetsu;
