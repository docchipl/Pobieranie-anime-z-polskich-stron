import axios, { Axios, AxiosRequestConfig } from 'axios';

export class AxiosClient {
  private client: Axios;
  constructor(private baseUrl: string) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 2000,
    });
  }

  async get<T>(config?: AxiosRequestConfig) {
    return await this.client.get<T>(this.baseUrl, config);
  }
}
