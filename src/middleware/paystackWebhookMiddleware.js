//verifysignature

import crypto from 'crypto'



const verifyWebhook = (req, res, next) =>{

const signature = req.headers['x-paystack-signature']

const secret = process.env.PAYSTACK_SECRET_KEY

const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

if (!signature) {

return res.status(401).json({ message: 'No signature provided' })

}

if (hash === signature) {

return next()

 } else {

return res.status(401).json({ message: 'Invalid signature' })

 }

}


export default verifyWebhook