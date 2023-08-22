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
const CompileEpisodeData_js_1 = __importDefault(require("../../utils/CompileEpisodeData.js"));
const virtualConsole = new jsdom_1.VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
function ServiceJuniorSubs(category, anime, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://juniorsubs.pl/${category}/${anime}/odcinek-${episode}`, {
                headers: {
                    Referer: `https://juniorsubs.pl/${category}/${anime}/odcinek-${episode}`,
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const dom = new jsdom_1.JSDOM(response.data, { virtualConsole });
            const pIframe = dom.window.document.querySelector('.elementor-widget[data-element_type="widget"] .elementor-widget-container iframe');
            if (!pIframe) {
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            }
            const data = (0, CompileEpisodeData_js_1.default)(pIframe.src);
            if (!data ||
                !data.hosting ||
                !data.player_embed ||
                new URL(response.request.res.responseUrl).pathname !==
                    `/${category}/${anime}/odcinek-${episode}/`) {
                return {
                    status: 500,
                    message: "Something went wrong!",
                };
            }
            const thumbnail = yield (0, index_js_1.JuniorSubsAPI)(category, anime, Number(episode));
            return {
                status: 200,
                message: "Mission Accomplished!",
                episode_thumbnail: thumbnail && thumbnail.thumbnail ? thumbnail.thumbnail : null,
                episodes: [
                    {
                        player: data.hosting,
                        url: data.player_embed,
                    },
                ],
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
exports.default = ServiceJuniorSubs;
