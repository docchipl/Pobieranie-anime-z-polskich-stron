import axios from "axios";
export default async function OrfeuszSubsEpisodes(anime, episode) {
    try {
        const response = await axios.get(`https://api.orfeusz-subs.pl/api/episode/list?id=${anime}`, {
            headers: {
                Accept: `application/json`,
            },
        });
        if (response.data.length <= 0) {
            return {
                status: 500,
            };
        }
        const indexOfObject = response.data.findIndex((object) => {
            return object.number === Number(episode);
        });
        if (indexOfObject === -1) {
            return {
                status: 500,
            };
        }
        return {
            status: 200,
            episode_id: response.data[indexOfObject].id,
            bg: null
        };
    }
    catch (error) {
        return {
            status: 500,
        };
    }
}
