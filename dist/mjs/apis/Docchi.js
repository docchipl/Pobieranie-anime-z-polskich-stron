import axios from "axios";
export default async function Docchi(anime, episode) {
    try {
        const response = await axios.get(`https://api.docchi.pl/v1/episodes/find/${anime}/${episode}`, {
            headers: {
                Accept: `application/json`,
            },
        });
        if (response.data.length <= 0) {
            return {
                status: 500,
                message: "Something went wrong!",
            };
        }
        return {
            status: 200,
            message: "Mission Accomplished!",
            episode_thumbnail: response.data[0].bg ?? null,
            episodes: response.data.map(function (x) {
                return {
                    player: x.player_hosting,
                    url: x.player,
                    translator: x.translator_title.trim() === "" ? "none" : x.translator_title.trim()
                };
            }),
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
