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
const index_js_1 = require("../apis/index.js");
const virtualConsole = new jsdom_1.VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
function ServiceWbijam(anime, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://${anime}.wbijam.pl/${episode}.html`, {
                headers: {
                    Referer: `https://${anime}.wbijam.pl/${episode}.html`,
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const dom = new jsdom_1.JSDOM(response.data, { virtualConsole });
            const items = dom.window.document.querySelectorAll("tr.lista_hover");
            const nextEpisodeButton = dom.window.document.querySelector(".nawigacja_prawa a");
            const episode_next_url = nextEpisodeButton ? nextEpisodeButton.href : null;
            const tURL = dom.window.document.querySelector(`a[rel="galeria"]`);
            const thumbnail = tURL ? `https://${anime}.wbijam.pl/${tURL.href}` : null;
            let episodes_cleaning = [];
            if (!items) {
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            }
            const iArray = Array.from(items);
            if (iArray.length === 0 &&
                !dom.window.document.querySelector(".pod_naglowek"))
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            if (iArray.length === 0 &&
                dom.window.document.querySelector(".pod_naglowek"))
                return {
                    status: 204,
                    message: "Page loads but doesn't have any players.",
                };
            const iArrayElement = iArray[0];
            const iArrayURL = iArrayElement.textContent;
            if (iArray.length === 1 &&
                iArrayElement &&
                iArrayURL &&
                iArrayURL.includes("zwiastun"))
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            yield Promise.all(Array.from(items).map(function (x) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!x)
                        return;
                    const pURL = x.querySelector(".odtwarzacz_link");
                    const pNAMES = x.querySelectorAll("td.center");
                    if (!pURL || !pNAMES || pNAMES.length <= 1 || !pNAMES[2].textContent)
                        return;
                    const player_info = {
                        anime: anime,
                        slug: pURL.getAttribute("rel"),
                        player_name: pNAMES[2].textContent,
                    };
                    if (player_info.player_name.toLowerCase() === "vk")
                        return;
                    const requestPlayer = yield (0, index_js_1.WbijamAPI)(player_info);
                    if (!requestPlayer || !requestPlayer.player)
                        return;
                    episodes_cleaning.push({
                        player: player_info.player_name,
                        url: requestPlayer.player,
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
                episode_thumbnail: thumbnail,
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
exports.default = ServiceWbijam;
