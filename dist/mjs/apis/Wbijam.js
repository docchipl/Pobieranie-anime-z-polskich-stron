import axios from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
export default async function Wbijam({ slug, anime, }) {
    try {
        const response = await axios.get(`https://${anime}.wbijam.pl/odtwarzacz-${slug}.html`, {
            headers: {
                Referer: `https://${anime}.wbijam.pl/odtwarzacz-${slug}.html`,
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const dom = new JSDOM(response.data, { virtualConsole });
        const player_url = dom.window.document.querySelector("center iframe");
        if (!player_url) {
            return {
                status: 500,
            };
        }
        return {
            status: 200,
            player: player_url.src,
        };
    }
    catch (error) {
        return {
            status: 500,
        };
    }
}
