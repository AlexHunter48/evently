import crypto from 'crypto';

const verifyWebhook = (req, res, next) => {
    const signature = req.headers['x-paystack-signature'];
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!signature) {
        return res.status(401).json({ message: 'Missing Paystack signature header' });
    }

    
    const rawBody = req.rawBody || JSON.stringify(req.body); 

    const hash = crypto
        .createHmac('sha512', secret)
        .update(rawBody) 
        .digest('hex');

   
    const hashBuffer = Buffer.from(hash, 'utf-8');
    const sigBuffer = Buffer.from(signature, 'utf-8');

   
    if (hashBuffer.length !== sigBuffer.length) {
        console.warn('⚠️ Webhook Warning: Signature length mismatch.');
        return res.status(401).json({ message: 'Invalid signature' });
    }

    const dataMatches = crypto.timingSafeEqual(hashBuffer, sigBuffer);

    if (dataMatches) {
        return next();
    } else {
        console.warn('⚠️ Webhook Warning: Cryptographic signature mismatch.');
        return res.status(401).json({ message: 'Invalid signature' });
    }
};

export default verifyWebhook;
export default verifyWebhook;
