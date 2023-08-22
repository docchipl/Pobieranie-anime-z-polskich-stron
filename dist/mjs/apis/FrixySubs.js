import axios from "axios";
export default async function FrixySubs(anime, episode) {
    try {
        const response = await axios.get(`https://frixysubs.pl/api/anime/${anime}/${episode}`, {
            headers: {
                Accept: `application/json`,
            },
        });
        const { episode: { poster, players }, } = response.data;
        if (players.length <= 0) {
            return {
                status: 500,
                message: "Something went wrong!",
            };
        }
        return {
            status: 200,
            message: "Mission Accomplished!",
            episode_thumbnail: poster ?? null,
            episodes: players.map(function (x) {
                return {
                    player: x.name,
                    url: x.link,
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
