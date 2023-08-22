import axios, { AxiosResponse } from "axios";

//Response Interfaces
interface IPlayer {
  embed_url: string;
}

export default async function MioroSubsAPI(
  action: string,
  post: string,
  nume: string,
  type: string
): Promise<{
  status: number;
  player?: string;
}> {
  try {
    const form = new FormData();
    form.append("action", action);
    form.append("post", post);
    form.append("nume", nume);
    form.append("type", type);
    const response: AxiosResponse<IPlayer> = await axios.post(
      `https://miorosubs.pl/wp-admin/admin-ajax.php`,
      form
    );

    if (!response.data.embed_url) {
      return {
        status: 500,
      };
    }

    return {
      status: 200,
      player: response.data.embed_url,
    };
  } catch (error) {
    return {
      status: 500,
    };
  }
}
