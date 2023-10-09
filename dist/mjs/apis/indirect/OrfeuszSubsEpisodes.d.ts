export default function OrfeuszSubsEpisodes(anime: string, episode: string | number): Promise<{
    status: number;
    episode_id?: number;
    bg?: string | null;
}>;
