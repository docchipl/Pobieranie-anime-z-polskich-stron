import OrfeuszSubsEpisodes from "./indirect/OrfeuszSubsEpisodes.js";
import OrfeuszSubsPlayers from "./indirect/OrfeuszSubsPlayers.js";
export default async function OrfeuszSubs(anime, episode) {
    const episodeID = await OrfeuszSubsEpisodes(anime, episode);
    if (episodeID.status !== 200 || !episodeID.episode_id) {
        return {
            status: 500,
            message: "Something went wrong!",
        };
    }
    const orfeusz = await OrfeuszSubsPlayers(episode, episodeID.episode_id, episodeID.bg);
    return orfeusz;
}
