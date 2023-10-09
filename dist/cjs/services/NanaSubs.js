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
const virtualConsole = new jsdom_1.VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
function ServiceNanaSubs(anime, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://nanasubs.com/anime/${anime}/odcinek-${episode}`, {
                headers: {
                    Referer: `https://nanasubs.com/anime/${anime}/odcinek-${episode}`,
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const dom = new jsdom_1.JSDOM(response.data, { virtualConsole });
            const nanaArray = dom.window.document.querySelectorAll(`script[type="application/ld+json"]`);
            const items = dom.window.document.querySelectorAll(".ns-episode-players-option");
            let episodes_cleaning = [];
            if (!items || !nanaArray) {
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            }
            const nD = Array.from(nanaArray);
            if (!nD || nD.length <= 1 || !nD[1].textContent) {
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            }
            const nanaData = JSON.parse(nD[1].textContent);
            yield Promise.all(Array.from(items).map(function (x) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!x ||
                        !x.getAttribute("data-player") ||
                        !x.getAttribute("data-player-url")) {
                        return;
                    }
                    episodes_cleaning.push({
                        player: x.getAttribute("data-player"),
                        url: x.getAttribute("data-player-url"),
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
                episode_thumbnail: nanaData.thumbnailUrl || null,
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
exports.default = ServiceNanaSubs;
