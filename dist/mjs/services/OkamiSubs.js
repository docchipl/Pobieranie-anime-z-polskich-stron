import axios from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
export default async function ServiceOkamiSubs(anime, episode) {
    try {
        const response = await axios.get(`https://okami-subs.pl/anime/${anime}/odcinek/${episode}`);
        const dom = new JSDOM(response.data, {
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
        await Promise.all(okamiData.episode_links.map(async function (x) {
            episodes_cleaning.push({
                player: x.player,
                url: x.url,
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
}
