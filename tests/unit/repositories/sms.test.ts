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
                responses: [{
                    "response-code": 200,
                    "response-description": "Success",
                    "mobile": "254733123456",
                    "messageid": 75085465,
                    "clientsmsid": "1234",
                    "networkid": "2"
                }],
            })

            const res = await sms.text('#WasilianaTest').to(validPhone).send()

            expect(res).toStrictEqual([{
                code: 200,
                description: 'Success',
                message_id: 75085465,
                client_sms_id: "1234",
                network_id: "2",
                mobile: "254733123456",
                cost: .2
            }])
            expect(request).toHaveBeenNthCalledWith(1, {
                url: '/services/sendbulk', data: {
                    count: 1,
                    smslist: [{
                        apikey: 'apiKey',
                        partnerID: 'partnerId',
                        pass_type: "plain",
                        clientsmsid: 0,
                        mobile: validPhone,
                        message: '#WasilianaTest',
                        shortcode: 'senderId',
                    }]
                }
            })
        });
    })
})