import { JuniorSubsAPI } from "../../apis/index.js";
import axios from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
import CompilePlayerData from "../../utils/CompileEpisodeData.js";
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
export default async function ServiceJuniorSubs(category, anime, episode) {
    try {
        const response = await axios.get(`https://juniorsubs.pl/${category}/${anime}/odcinek-${episode}`, {
            headers: {
                Referer: `https://juniorsubs.pl/${category}/${anime}/odcinek-${episode}`,
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const dom = new JSDOM(response.data, { virtualConsole });
        const pIframe = dom.window.document.querySelector('.elementor-widget[data-element_type="widget"] .elementor-widget-container iframe');
        if (!pIframe) {
            return {
                status: 500,
                message: "Something went wrong!",
            };
        }
        const data = CompilePlayerData(pIframe.src);
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
        const thumbnail = await JuniorSubsAPI(category, anime, Number(episode));
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
}
