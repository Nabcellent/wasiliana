import { beforeAll, describe, expect, it, vi } from "vitest";
import { Wasiliana } from "../../../src";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { UnauthorizedErr } from "../../../src/exceptions/unauthorized.err";
import { NotFoundError } from "../../../src/exceptions/not-found.err";

let wasiliana: Wasiliana;

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
                    return Promise.resolve(<R>{ data: { Data: [{ Credits: 'Ksh1.00', PluginType: 'SMS' }] } })
                }
            } as AxiosInstance)

            await wasiliana.balance.fetch()

            expect(axios.create).toHaveBeenCalledOnce()
        });

        it('should throw an unauthorized error', async function () {
            vi.spyOn(axios, 'create').mockReturnValue({
                post<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
                    return Promise.reject(new UnauthorizedErr)
                }
            } as AxiosInstance)

            await expect(wasiliana.balance.fetch()).rejects.toThrow('Unauthorized!')
        });

        it('should throw a not found error', async function () {
            vi.spyOn(axios, 'create').mockReturnValue({
                post<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
                    return Promise.reject(new NotFoundError)
                }
            } as AxiosInstance)

            await expect(wasiliana.balance.fetch()).rejects.toThrow('Not Found!')
        });
    })
})