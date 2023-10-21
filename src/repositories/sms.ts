import { Wasiliana } from "../client";
import { ValidationErr } from "../exceptions/validation.err";
import { WasilianaRawResponse, WasilianaRequest, WasilianaResponse, } from "../utils";
import { isValidPhoneNumber } from "libphonenumber-js";

export class Sms {
    #client: Wasiliana
    #message: string = "";
    #messageId?: string | number;
    #phones: (string | number)[] = [];

    constructor(client: Wasiliana) {
        this.#client = client;
    }

    public text(message: string) {
        this.#message = message;
        return this;
    }

    public to(to: string | number | (string | number)[]) {
        this.#phones = Array.isArray(to) ? to : [to]

        return this;
    }

    public messageId(id: string | number) {
        this.#messageId = id

        return this;
    }

    public send = async (): Promise<WasilianaResponse[]> => {
        if (!this.#message) throw new ValidationErr('Text message is required.')
        if (this.#phones.length <= 0) throw new ValidationErr('Phone number is required.')

        this.#phones.forEach(p => {
            if (!isValidPhoneNumber(String(p), 'KE')) {
                throw new ValidationErr(`${p} is an invalid Kenyan phone number.`)
            }
        })

        let data: WasilianaRequest = {
            recipients: this.#phones,
            from: this.#client.config.senderId,
            message: this.#message
        }

        if (this.#messageId) data.message_uid = this.#messageId

        const res: WasilianaRawResponse = await this.#client.makeRequest({ url: '/send/sms', data })

        return this.#phones.map(p => ({
            description: res.data,
            phone: p,
            cost: this.cost(this.#message),
            status: res.status
        }))
    }

    public cost(text: string): number {
        // console.log(`TEXT:\n"${text}"`, `\n\nLENGTH: ${text.length}`)

        let cost = Number(process.env.WASILIANA_SMS_COST || .2);

        return Math.ceil(text.length / 160) * cost
    }
}