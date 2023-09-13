import { afterEach, beforeAll, describe, expect, it, SpyInstance, vi } from "vitest";
import { Sms } from "../../../src/repositories/sms";
import { Wasiliana } from "../../../src";
import { ValidationErr } from "../../../src/exceptions/validation.err";

let wasiliana: Wasiliana, sms: Sms, makeRequest: SpyInstance;
const validPhone = 254110039317, invalidPhone = '82547123456789'

describe('sms', () => {
    beforeAll(() => {
        wasiliana = new Wasiliana({
            apiKey: "apiKey",
            senderId: 'senderId'
        })
        sms = wasiliana.sms
        makeRequest = vi.spyOn(wasiliana, 'makeRequest')
    })

    afterEach(() => {
        vi.restoreAllMocks();

        wasiliana = new Wasiliana({
            apiKey: "apiKey",
            senderId: 'senderId'
        })
        sms = wasiliana.sms
        makeRequest = vi.spyOn(wasiliana, 'makeRequest')
    });

    describe('send', () => {
        it('should reject invalid phone numbers', () => {
            let phoneNumbers = ['+254713', '+2547XXXXXXXX', '0712345678', '+25571234567890', ''];

            expect(() => sms.text('#WasilianaTest').send()).rejects.toThrow('Phone number is required.')
            expect(() => sms.text('#WasilianaTest').to(invalidPhone).send()).rejects.toThrow(`${invalidPhone} is an invalid Kenyan phone number.`)
            expect(() => sms.text('#WasilianaTest').to(phoneNumbers).send()).rejects.toThrow(`+254713 is an invalid Kenyan phone number.`)
        });

        it('should reject empty messages', () => {
            expect(() => sms.to(validPhone).send()).rejects.toThrow(ValidationErr)
            expect(() => sms.text('').to(validPhone).send()).rejects.toThrow('Text message is required.')
        });

        it('should send SMS if data is valid.', async () => {
            const request = makeRequest.mockResolvedValue({
                status: 'success',
                data: "Successfully Dispatched the sms to process"
            })

            const res = await sms.text('#WasilianaTest').to(validPhone).send()

            expect(res).toStrictEqual([{
                status: 'success',
                description: "Successfully Dispatched the sms to process",
                phone: validPhone,
                cost: .2
            }])

            expect(request).toHaveBeenNthCalledWith(1, {
                url: '/send/sms', data: {
                    recipients: [validPhone],
                    from: wasiliana.config.senderId,
                    message: '#WasilianaTest'
                }
            })
        });
    })
})