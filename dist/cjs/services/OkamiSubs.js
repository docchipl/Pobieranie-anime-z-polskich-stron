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
function ServiceOkamiSubs(anime, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://okami-subs.pl/anime/${anime}/odcinek/${episode}`);
            const dom = new jsdom_1.JSDOM(response.data, {
                runScripts: "dangerously",
                virtualConsole,
            }).window;
            const okamiData = dom.InitData;
            let episode_next_url = null;
            let episodes_cleaning = [];
            if (!okamiData) {
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            }
            yield Promise.all(okamiData.episode_links.map(function (x) {
                return __awaiter(this, void 0, void 0, function* () {
                    episodes_cleaning.push({
                        player: x.player,
                        url: x.url,
                    });
                });
            }));
            if (dom.document.querySelector(".col-md-4.col-xs-12 .button.pull-right")) {
                const item = dom.document.querySelector(".col-md-4.col-xs-12 .button.pull-right");
                if (item) {
                    episode_next_url = item.href.split("/").pop();
                }
            }
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
exports.default = ServiceOkamiSubs;
