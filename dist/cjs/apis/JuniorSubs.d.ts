export default function JuniorSubs(category: string | number, anime: string, episode: string | number): Promise<{
    status: number;
    thumbnail?: string | null;
}>;
