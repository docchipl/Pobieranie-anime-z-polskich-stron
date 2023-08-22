import OrfeuszSubsEpisodes from "./indirect/OrfeuszSubsEpisodes";
import OrfeuszSubsPlayers from "./indirect/OrfeuszSubsPlayers";

//Return Interfaces
interface IPlayer {
  player: string;
  url: string;
}

export default async function OrfeuszSubs(
  anime: string,
  episode: number | string
): Promise<{
  status: number;
  message: string;
  episode_thumbnail?: string | null;
  episodes?: IPlayer[];
  episode_next_url?: string | number;
}> {
  const episodeID = await OrfeuszSubsEpisodes(anime, episode);

  if(episodeID.status !== 200 || !episodeID.episode_id){
    return {
        status: 500,
        message: "Something went wrong!",
    };
  }
  const orfeusz = await OrfeuszSubsPlayers(episode, episodeID.episode_id, episodeID.bg);

  return orfeusz;
}
