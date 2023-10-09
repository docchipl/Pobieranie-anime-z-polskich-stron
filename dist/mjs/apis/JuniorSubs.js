import axios from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
export default async function JuniorSubs(category, anime, episode) {
    try {
        const response = await axios.get(`https://juniorsubs.pl/${category}/${anime}`, {
            headers: {
                Referer: `https://juniorsubs.pl/${category}/${anime}`,
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const dom = new JSDOM(response.data, { virtualConsole });
        const items = dom.window.document.querySelectorAll(".elementor-container .elementor-column.elementor-element .elementor-widget-container .elementor-heading-title ");
        const thumbnails = dom.window.document.querySelectorAll(".elementor-container .elementor-column.elementor-element .elementor-widget-wrap .elementor-widget-image .elementor-widget-container");
        let thumbnail = null;
        await Promise.all(Array.from(items).map(async function (x, index) {
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
}
