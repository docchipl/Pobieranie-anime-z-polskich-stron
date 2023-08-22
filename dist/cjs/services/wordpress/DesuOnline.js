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
function ServiceDesuOnline(anime, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://desu-online.pl/${anime}-odcinek-${episode}`, {
                headers: {
                    Referer: `https://desu-online.pl/${anime}-odcinek-${episode}`,
                    "X-Requested-With": "XMLHttpRequest",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                },
            });
            const dom = new jsdom_1.JSDOM(response.data, { virtualConsole });
            const items = dom.window.document.querySelectorAll(".mobius select.mirror option");
            let episodes_cleaning = [];
            yield Promise.all(Array.from(items).map(function (x) {
                return __awaiter(this, void 0, void 0, function* () {
                    const item = x;
                    if (!item || !item.textContent || !item.value) {
                        return;
                    }
                    if (item.textContent.toLowerCase().includes("wybierz"))
                        return;
                    const player_url = Buffer.from(item.value, "base64")
                        .toString("utf8")
                        .match(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim);
                    if (!player_url) {
                        return;
                    }
                    const playerURL = player_url && typeof player_url !== "string"
                        ? player_url[0]
                        : player_url;
                    episodes_cleaning.push({
                        player: item.textContent.toUpperCase().replaceAll("\n", "").trim(),
                        url: playerURL,
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
exports.default = ServiceDesuOnline;
