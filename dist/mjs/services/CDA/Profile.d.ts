interface IPlayer {
    player: string;
    url: string;
    episode_number?: number;
    episode_thumbnail?: string | null;
}
export default function ServiceCDAProfile(user: string, keyword: string, type: string, spaces: number, episode: number | string): Promise<{
    status: number;
    message: string;
    episode_thumbnail?: string | null;
    episodes?: IPlayer[];
    episode_next_url?: string | number;
}>;
export {};
