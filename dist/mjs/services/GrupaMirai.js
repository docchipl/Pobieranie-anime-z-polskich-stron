import axios from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
export default async function ServiceGrupaMirai(anime, episode) {
    try {
        const response = await axios.get(`https://www.grupa-mirai.pl/${anime}`, {
            headers: {
                Referer: `https://www.grupa-mirai.pl/${anime}`,
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            },
        });
        const dom = new JSDOM(response.data, { runScripts: 'dangerously', virtualConsole });
        const cdaPlayer = dom.window.epCda || dom.window.epCDA;
        const megaPlayer = dom.window.epMega;
        const sibnetPlayer = dom.window.epSibnet;
        let episodes_cleaning = [];
        if (cdaPlayer && cdaPlayer[episode]) {
            episodes_cleaning.push({
                player: "CDA",
                url: "https://ebd.cda.pl/620x395/" + cdaPlayer[episode],
            });
        }
        if (megaPlayer && megaPlayer[episode]) {
            episodes_cleaning.push({
                player: "MEGA",
                url: "https://mega.nz/embed/" + megaPlayer[episode],
            });
        }
        if (sibnetPlayer && sibnetPlayer[episode]) {
            episodes_cleaning.push({
                player: "SIBNET",
                url: "https://video.sibnet.ru/shell.php?videoid=" + sibnetPlayer[episode],
            });
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
