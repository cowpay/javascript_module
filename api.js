import axios from 'axios';
import SHA256 from 'sha256';

axios.defaults.baseURL = 'https://cowpay.me/api/v1/';

export default class CowpayService {

    constructor(merchantCode, merchantHash, token) {
        this.merchant_code = merchantCode;
        this.merchant_hash = merchantHash;
        this.token = token;
    }

    creditCardChargeRequest(params) {
        return axios.post('charge/card', {
            merchant_reference_id: params.merchant_reference_id,
            payment_method: params.payment_method,
            customer_merchant_profile_id: params.customer_merchant_profile_id,
            card_number: params.card_number,
            expiry_year: params.expiry_year,
            expiry_month: params.expiry_month,
            cvv: params.cvv,
            customer_name: params.customer_name,
            customer_mobile: params.customer_mobile,
            customer_email: params.customer_email,
            amount: params.amount,
            description: params.description,
            signature: SHA256([
                this.merchant_code,
                params.merchant_reference_id,
                params.customer_merchant_profile_id,
                'CARD',
                params.amount,
                this.merchant_hash
            ].join('')),

        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
    }

    fawryChargeRequest(params) {
        return axios.post('charge/fawry',
            {
                merchant_reference_id: params.merchant_reference_id,
                customer_merchant_profile_id: params.customer_merchant_profile_id,
                customer_name: params.customer_name,
                customer_mobile: params.customer_mobile,
                customer_email: params.customer_email,
                amount: params.amount,
                signature: SHA256([
                    this.merchant_code,
                    params.merchant_reference_id,
                    params.customer_merchant_profile_id,
                    params.amount,
                    this.merchant_hash
                ].join('')),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            })
    }

    getPaymentStatus(merchant_reference_id) {
        return axios.get('charge/status', {
            params: {
                merchant_reference_id: merchant_reference_id,
                signature: SHA256(this.merchant_code + merchant_reference_id + this.merchant_hash)
            },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
    }
}
