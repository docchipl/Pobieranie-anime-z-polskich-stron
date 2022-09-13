import axios, { Axios } from 'axios';

export class AxiosClient {
  private client: Axios;
  constructor(private baseUrl: string) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 1000,
      headers: {
        Referer: baseUrl,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
  }

  async get<T>() {
    return await this.client.get<T>(this.baseUrl);
  }
}
