import axios, { Axios, AxiosRequestConfig } from 'axios';

export class AxiosClient {
  private client: Axios;
  constructor(private baseUrl: string, private timeout: number = 2000) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
    });
  }

  async get<T>(config?: AxiosRequestConfig) {
    return await this.client.get<T>(this.baseUrl, config);
  }
}
