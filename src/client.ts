import { WasilianaConfig } from "./utils";
import { Sms } from "./repositories/sms";
import axios, { AxiosError } from "axios";
import { ValidationErr } from "./exceptions/validation.err";
import { UnauthorizedErr } from "./exceptions/unauthorized.err";
import { NotFoundError } from "./exceptions/not-found.err";
import { BadRequestError } from "./exceptions/bad-request.err";

export class Wasiliana {
    config: WasilianaConfig
    sms: Sms = new Sms(this)

    constructor(config: WasilianaConfig) {
        this.config = config
        this.config.baseUrl = config.baseUrl || 'https://api.wasiliana.com/api/v1'
    }

    makeRequest = async ({ url, method = 'post', data = {} }: { url: string, method?: 'get' | 'post', data?: any }) => {
        const http = axios.create({
            baseURL: this.config.baseUrl,
            headers: {
                Accept: 'application/json',
                ContentType: 'application/json'
            }
        });

        return http[method](url, data).then(({ data }) => data).catch(e => {
            if (e instanceof AxiosError) {
                if (e.response?.status === 422) {
                    throw new ValidationErr(e.response.data.errors)
                }
                if (e.response?.status === 401) {
                    throw new UnauthorizedErr(e.response?.data['response-description'])
                }
                if (e.response?.status === 404) {
                    throw new NotFoundError()
                }
            }

            throw new BadRequestError(e.message || 'Something went wrong')
        })
    }
}