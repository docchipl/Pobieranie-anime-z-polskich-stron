interface ResponseSource {
    status: number;
    message: string;
    episode_thumbnail?: string | null;
    episodes?: {
        player: string;
        url: string;
        episode_number?: number;
        episode_thumbnail?: string | null;
    }[];
    episode_next_url?: string | number | null;
}
interface FunctionTypes {
    anime?: string;
    episode: number | string;
    website: string;
    user?: string;
    folder?: number | string;
    type?: string;
    spaces?: number;
    keyword?: string;
    url?: string;
}
export default function runScript({ anime, episode, website, user, folder, type, spaces, keyword, }: FunctionTypes): Promise<ResponseSource>;
export {};
