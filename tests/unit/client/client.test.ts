import { beforeAll, describe, expect, it, vi } from "vitest";
import { Wasiliana } from "../../../src";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { UnauthorizedErr } from "../../../src/exceptions/unauthorized.err";
import { NotFoundError } from "../../../src/exceptions/not-found.err";

let wasiliana: Wasiliana;
const validPhone = 254110039317;

vi.mock('../../../src/utils/logger', () => ({
    log: {
        info: vi.fn(),
        error: vi.fn()
    }
}));

describe('client', () => {
    beforeAll(() => {
        wasiliana = new Wasiliana({
            apiKey: "apiKey",
            senderId: 'senderId'
        })
    })

    describe('makeRequest', () => {
        it('should call axios', async function () {
            vi.spyOn(axios, 'create').mockReturnValue({
                post<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
                    return Promise.resolve(<R>{
                        data: {
                            status: 'success',
                            data: 'Successfully Dispatched the sms to process'
                        }
                    })
                }
            } as AxiosInstance)

            await wasiliana.sms.text('Test').to(validPhone).send()

            expect(axios.create).toHaveBeenCalledOnce()
        });

        it('should throw an unauthorized error', async function () {
            vi.spyOn(axios, 'create').mockReturnValue({
                post<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
                    return Promise.reject(new UnauthorizedErr)
                }
            } as AxiosInstance)

            await expect(wasiliana.sms.text('Test').to(validPhone).send()).rejects.toThrow('Unauthorized!')
        });

        it('should throw a not found error', async function () {
            vi.spyOn(axios, 'create').mockReturnValue({
                post<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
                    return Promise.reject(new NotFoundError)
                }
            } as AxiosInstance)

            await expect(wasiliana.sms.text('Test').to(validPhone).send()).rejects.toThrow('Not Found!')
        });
    })
})