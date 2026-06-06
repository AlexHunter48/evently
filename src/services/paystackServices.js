
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

const paystackBaseUrl = 'https://api.paystack.co'

const verifyTransaction = async (reference) => {
    try {
        const response = await axios.get(`${paystackBaseUrl}/transaction/verify/${reference}`, {
            headers:{
                Authorization: `Bearer ${paystackSecretKey}`
            }
        })
        return response.data
    } catch (error) {
        throw new Error('Failed to verify transaction')
    }
}

export {verifyTransaction}