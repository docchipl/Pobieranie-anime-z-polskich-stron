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
const CompileEpisodeData_js_1 = __importDefault(require("../../utils/CompileEpisodeData.js"));
const virtualConsole = new jsdom_1.VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
function ServicePaldea(episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://paldea.pl/odcinek/${episode}`, {
                headers: {
                    Referer: `https://paldea.pl/odcinek/${episode}`,
                    "X-Requested-With": "XMLHttpRequest",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                },
            });
            const dom = new jsdom_1.JSDOM(response.data, { virtualConsole });
            const vC = dom.window.document.querySelectorAll(".video-container");
            const urls = dom.window.document.querySelectorAll(".post-content .fusion-layout-column .fusion-column-wrapper a.fusion-button");
            let episodes_cleaning = [];
            let episode_next_url = null;
            yield Promise.all(Array.from(urls).map(function (x) {
                return __awaiter(this, void 0, void 0, function* () {
                    const item = x;
                    const urlArray = item.href.split("/");
                    if (!urlArray.includes("odcinek")) {
                        return;
                    }
                    const episodeNumber = urlArray.length >= 6 ? urlArray[4] : urlArray.pop();
                    if (!episodeNumber || episodeNumber === episode) {
                        return;
                    }
                    episode_next_url = episodeNumber !== null && episodeNumber !== void 0 ? episodeNumber : null;
                });
            }));
            yield Promise.all(Array.from(vC).map(function (x) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!x)
                        return;
                    const player = x.querySelector("iframe");
                    const data = (0, CompileEpisodeData_js_1.default)(player.src);
                    if (!data || !data.player_embed || !data.hosting) {
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
                episode_next_url: episode_next_url,
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
exports.default = ServicePaldea;
