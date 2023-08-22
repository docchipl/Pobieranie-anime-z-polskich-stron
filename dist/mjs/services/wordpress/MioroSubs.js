import { MioroSubsAPI } from "../../apis/index.js";
import axios from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
const tNFun = (tn) => {
    const imgElement = tn;
    return imgElement.href;
};
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
export default async function ServiceMioroSubs(anime, episode) {
    try {
        const response = await axios.get(`https://miorosubs.pl/episodes/${anime}x${episode}`, {
            headers: {
                Referer: `https://miorosubs.pl/episodes/${anime}x${episode}`,
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const dom = new JSDOM(response.data, { virtualConsole });
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
        await Promise.all(Array.from(items).map(async function (x) {
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
            const playerInfo = await MioroSubsAPI("doo_player_ajax", x.getAttribute("data-post"), x.getAttribute("data-nume"), x.getAttribute("data-type"));
            if (playerInfo.status !== 200 || !playerInfo.player) {
                return;
            }
            episodes_cleaning.push({
                player: pT.textContent,
                url: playerInfo.player,
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
}
