import axios from "axios";
import { JSDOM, VirtualConsole } from "jsdom";
const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});
const tNFun = (tn) => {
    const imgElement = tn;
    return imgElement.src.replaceAll("192x108.jpg", "1280x720.jpg");
};
export default async function ServiceCDAFolder(user, folder, type, spaces, episode) {
    try {
        const response = await axios.get(`https://www.cda.pl/${user}/folder/${folder}`, {
            headers: {
                Referer: `https://www.cda.pl/${user}/folder/${folder}`,
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        if (!["spaces", "s0e0"].includes(type)) {
            return {
                status: 400,
                message: "Invalid request type. Only accept (spaces, s0e0) format.",
            };
        }
        const dom = new JSDOM(response.data, { virtualConsole });
        const thumbnails = dom.window.document.querySelectorAll(".list-when-small.tip .thumbnail.viewList-inline .wrapper-thumb-link .thumbnail-link img.thumb");
        const items = dom.window.document.querySelectorAll(".list-when-small.tip .thumbnail.viewList-inline .caption .caption-label");
        let episodes_cleaning = [];
        await Promise.all(Array.from(items).map(function (x, index) {
            const tN = thumbnails[index];
            if (type.toLowerCase() === "spaces") {
                const pT = x.querySelector("a");
                if (!pT || !pT.textContent || !pT.href)
                    return;
                const player_title = Number(pT.textContent.split(" ")[spaces]);
                /* It's checking if the episode is equal to "all" and if it is, it's pushing the url to the array and
                  returning. */
                if (episode === "all") {
                    return episodes_cleaning.push({
                        player: "CDA",
                        url: `https://www.cda.pl${pT.href}`,
                        episode_number: player_title,
                        episode_thumbnail: tN ? tNFun(tN) : null,
                    });
                }
                /* Checking if the episode number is the same as the one you are looking for. */
                if (player_title !== Number(episode))
                    return;
                /* Pushing the url to the array. */
                return episodes_cleaning.push({
                    player: "CDA",
                    url: `https://www.cda.pl${pT.href}`,
                    episode_thumbnail: tN ? tNFun(tN) : null,
                });
            }
            if (type.toLowerCase() === "s0e0") {
                const pT = x.querySelector("a");
                if (!pT || !pT.textContent || !pT.href)
                    return;
                const player_title = Number(pT.textContent
                    .split(" ")[spaces].replace(/[A-Za-z]/g, " ")
                    .split(" ")[2]);
                /* It's checking if the episode is equal to "all" and if it is, it's pushing the url to the array and
                  returning. */
                if (episode === "all") {
                    return episodes_cleaning.push({
                        player: "CDA",
                        url: `https://www.cda.pl${pT.href}`,
                        episode_number: player_title,
                        episode_thumbnail: tN ? tNFun(tN) : null,
                    });
                }
                /* Checking if the episode number is the same as the one you are looking for. */
                if (player_title !== Number(episode))
                    return;
                /* Pushing the url to the array. */
                return episodes_cleaning.push({
                    player: "CDA",
                    url: `https://www.cda.pl${pT.href}`,
                    episode_thumbnail: tN ? tNFun(tN) : null,
                });
            }
            return;
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
            episodes: episodes_cleaning,
            episode_next_url: episode === "all" ? "all" : Number(episode) + 1,
        };
    }
    catch (error) {
        return {
            status: 500,
            message: "Something went wrong!",
        };
    }
}
