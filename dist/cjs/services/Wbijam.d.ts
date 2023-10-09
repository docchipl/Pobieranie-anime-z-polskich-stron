interface IPlayer {
    player: string;
    url: string;
}
export default function ServiceWbijam(anime: string, episode: string | number): Promise<{
    status: number;
    message: string;
    episode_thumbnail?: string | null;
    episodes?: IPlayer[];
    episode_next_url?: string | number | null;
}>;
export {};
