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
const index_js_1 = require("../../apis/index.js");
const axios_1 = __importDefault(require("axios"));
const jsdom_1 = require("jsdom");
const tNFun = (tn) => {
    const imgElement = tn;
    return imgElement.href;
};
const virtualConsole = new jsdom_1.VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
function ServiceMakiSubs(anime, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://makisubs.online/episodes/${anime}x${episode}`, {
                headers: {
                    Referer: `https://makisubs.online/episodes/${anime}x${episode}`,
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const dom = new jsdom_1.JSDOM(response.data, { virtualConsole });
            const thumbnail = dom.window.document.querySelector(".g-item a");
            const pO = dom.window.document.querySelector("#playeroptionsul");
            let episodes_cleaning = [];
            if (!pO) {
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            }
            const items = pO.querySelectorAll("li.dooplay_player_option");
            yield Promise.all(Array.from(items).map(function (x) {
                return __awaiter(this, void 0, void 0, function* () {
                    const pT = x.querySelector(".title");
                    if (!pT || !pT.textContent)
                        return;
                    const data = x;
                    if (!data ||
                        !data.getAttribute("data-post") ||
                        !data.getAttribute("data-nume") ||
                        !data.getAttribute("data-type")) {
                        return {
                            status: 500,
                            message: "Something went wrong!",
                        };
                    }
                    const playerInfo = yield (0, index_js_1.MakiSubsAPI)("doo_player_ajax", x.getAttribute("data-post"), x.getAttribute("data-nume"), x.getAttribute("data-type"));
                    if (playerInfo.status !== 200 || !playerInfo.player) {
                        return;
                    }
                    episodes_cleaning.push({
                        player: pT.textContent,
                        url: playerInfo.player,
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
                episode_thumbnail: thumbnail ? tNFun(thumbnail) : null,
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
exports.default = ServiceMakiSubs;
