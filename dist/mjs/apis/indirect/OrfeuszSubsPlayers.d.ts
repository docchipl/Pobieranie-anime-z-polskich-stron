interface IPlayer {
    player: string;
    url: string;
}
export default function OrfeuszSubsPlayers(episode: number | string, episode_id: number, bg?: string | null): Promise<{
    status: number;
    message: string;
    episode_thumbnail?: string | null;
    episodes?: IPlayer[];
    episode_next_url?: string | number;
}>;
export {};
