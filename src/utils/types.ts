export type WasilianaConfig = {
    apiKey: string
    senderId: string
    baseUrl?: string
}

export type WasilianaRequest = {
    recipients: (string | number)[]
    from: string
    message: string
    linkid?: string
    message_uid?: string|number
    is_otp?: string
}

export type WasilianaRawResponse = {
    status: 'success' | 'failed',
    data: string
}

export type WasilianaResponse = {
    status: 'success' | 'failed',
    description: string
    phone: string|number
    cost: number
}

export type WasilianaRawDeliveryReport = {
    phone: string[],
    correlator: string,
    deliveryStatus: "0" | "1" | "2"
    failure_reason?: string
}

export type WasilianaDeliveryReport = {
    phone: string[],
    message_id: string, //  Correlator
    delivery_status: "0" | "1" | "2"
    failure_reason?: string
}