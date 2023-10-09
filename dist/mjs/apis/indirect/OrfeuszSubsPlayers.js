import axios from "axios";
export default async function OrfeuszSubsPlayers(episode, episode_id, bg) {
    try {
        const response = await axios.get(`https://api.orfeusz-subs.pl/api/player/list?id=${episode_id}`, {
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
            episode_thumbnail: bg,
            episodes: response.data.map(function (x) {
                return {
                    player: x.source,
                    url: x.iframe,
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
