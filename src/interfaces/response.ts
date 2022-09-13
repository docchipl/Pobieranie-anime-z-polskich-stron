export interface AnimeSubsApiResponse {
  status: number;
  message: string;
  episode?: AnimeSubsEpisode[] | null;
  episode_next_url?: string | null;
}

export interface AnimeSubsEpisode {
  player: string;
  url: string;
}
