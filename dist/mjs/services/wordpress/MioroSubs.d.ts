interface IPlayer {
    player: string;
    url: string;
}
export default function ServiceMioroSubs(anime: string, episode: string | number): Promise<{
    status: number;
    message: string;
    episode_thumbnail?: string | null;
    episodes?: IPlayer[];
    episode_next_url?: string | number;
}>;
export {};
