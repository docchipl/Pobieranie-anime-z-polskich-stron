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
function JuniorSubs(category, anime, episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://juniorsubs.pl/${category}/${anime}`, {
                headers: {
                    Referer: `https://juniorsubs.pl/${category}/${anime}`,
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const dom = new jsdom_1.JSDOM(response.data, { virtualConsole });
            const items = dom.window.document.querySelectorAll(".elementor-container .elementor-column.elementor-element .elementor-widget-container .elementor-heading-title ");
            const thumbnails = dom.window.document.querySelectorAll(".elementor-container .elementor-column.elementor-element .elementor-widget-wrap .elementor-widget-image .elementor-widget-container");
            let thumbnail = null;
            yield Promise.all(Array.from(items).map(function (x, index) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!x || !x.textContent)
                        return;
                    const title = x.textContent.toLowerCase();
                    if (!title.includes("odcinek"))
                        return;
                    if (episode !== Number(title.replaceAll("odcinek", "")))
                        return;
                    if (!thumbnails || !thumbnails[index - 1])
                        return;
                    const tN = thumbnails[index - 1];
                    const tNIMG = tN.querySelector("img");
                    thumbnail = tNIMG.src || null;
                });
            }));
            return {
                status: 200,
                thumbnail: thumbnail,
            };
        }
        catch (error) {
            return {
                status: 500,
            };
        }
    });
}
exports.default = JuniorSubs;
