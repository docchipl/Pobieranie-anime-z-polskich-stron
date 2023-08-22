import axios from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
import CompilePlayerData from "../utils/CompileEpisodeData.js";
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
export default async function ServiceReikoProject(anime, episode) {
    try {
        const response = await axios.get(`https://reikoproject.blogspot.com/${anime}.html`, {
            headers: {
                Referer: `https://reikoproject.blogspot.com/${anime}.html`,
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const dom = new JSDOM(response.data, { virtualConsole });
        const items = dom.window.document.querySelectorAll(`div[style='font-family: "times new roman";'] i b`);
        let episodes_cleaning = [];
        if (!items) {
            return {
                status: 500,
                message: "Something went wrong!",
            };
        }
        await Promise.all(Array.from(items).map(function (x) {
            if (!x || !x.textContent || !x.querySelector("a"))
                return;
            const text = x.textContent;
            const link = x.querySelector("a");
            const episodeNumber = text.match(/(\d+)/);
            if (!link || !episodeNumber)
                return;
            const data = CompilePlayerData(link.href);
            if (!data.hosting || !data.player_embed) {
                return;
            }
            const defineNumber = Number(episodeNumber === null ? 9999 : episodeNumber[0]);
            if (defineNumber === Number(episode)) {
                episodes_cleaning.push({
                    player: data.hosting,
                    url: data.player_embed,
                });
            }
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
}
