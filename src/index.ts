import request from 'superagent'
import { createHmac } from 'crypto'
import { SourceTypes } from './source_types'
import { Modes } from './modes'
import { PaymentIntentAttributes } from './interfaces/paymentIntent';

export default class Paymongo {
    private publicKey: string
    private secretKey: string
    private baseUrl = 'https://api.paymongo.com/v1'

    constructor(publicKey: string, secretKey: string) {
        this.publicKey = publicKey
        this.secretKey = secretKey
    }

    static verifyWebhook = (webhookSecretKey: string, header: string, payload: object, mode: Modes) => {
        const [timestamp, testSig, liveSig] = header.split(',');

        if (!timestamp || !testSig || !liveSig) return false;

        const signatureComposition = `${timestamp.slice(2)}.${payload}`;
		const hmac = createHmac('sha256', webhookSecretKey);
		hmac.update(signatureComposition, 'utf8');
		const signature = hmac.digest('hex');

		const sigToCompare = mode === Modes.Test ? testSig.slice(3) : liveSig.slice(3);

		return signature === sigToCompare;
    }

    getHeaders(useSecret: boolean = true) {
        const authKey = useSecret ? this.secretKey : this.publicKey
        const authString = Buffer.from(`${authKey}:`).toString('base64')

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${authString}`,
        }

        return headers
    }

    constructPayload = (attributes: object) => ({
        data: { attributes },
    })

    sendRequest = (url: string, method: string = 'GET') => request(method, `${this.baseUrl}${url}`)

    createPaymentIntent = async (attributes: PaymentIntentAttributes) => {
        const { amount, ...rest } = attributes;

        console.log('Woah', amount);

		const payload = this.constructPayload({
            ...rest,
            amount: amount * 100,
            /** Override values for now until API updates */
			payment_method_allowed: ['card'],
			currency: 'PHP',
        })
        
        const result = await this.sendRequest('/payment_intents', 'POST').set(this.getHeaders()).send(payload)
        
		return result
    }

    createSource = async (amount: number, type: SourceTypes, redirectSuccess: string, redirectFail: string) => {
        const payload = this.constructPayload({
			type,
			amount: amount * 100,
			currency: 'PHP',
			redirect: {
				success: redirectSuccess,
				failed: redirectFail,
			},
        })
        
        const result = await this.sendRequest('/sources', 'POST').set(this.getHeaders()).send(payload)
        
		return result
    }

    createPayment = async (amount: number, sourceId: string, description: string) => {
        const payload = this.constructPayload({
			amount,
			description,
			currency: 'PHP',
			source: {
				id: sourceId,
				type: 'source',
			},
        })

        const result = await this.sendRequest('/payments', 'POST').set(this.getHeaders()).send(payload)
        
		return result
    }
}