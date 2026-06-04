//verifysignature
import crypto from 'crypto'


const verifyWebhook = (req, res, next) =>{
    signature = req.headers['x-paystack-signature']
    secret = process.env.PAYSTACK_SECRET_KEY
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == signature) {
        next()
    } else {
        res.status(401).json({ message: 'Invalid signature' })
    }
}

export default verifyWebhook