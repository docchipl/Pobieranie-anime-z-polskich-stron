export interface AnimeSubsApiResponse {
  status: number;
  message: string;
  episode_url?: {
    player: string;
    url: string;
  }[];
  episode_next_url?: string | null;
}
