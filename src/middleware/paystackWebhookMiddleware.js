
import crypto from 'crypto';

const verifyWebhook = (req, res, next) => {
    
    const signature = req.headers['x-paystack-signature'];
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!signature) {
        return res.status(401).json({ message: 'Missing Paystack signature header' });
    }

    
    const hash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

  
    const dataMatches = crypto.timingSafeEqual(
        Buffer.from(hash, 'utf-8'),
        Buffer.from(signature, 'utf-8')
    );

    if (dataMatches) {
        return next();
    } else {
        console.warn('⚠️ Webhook Warning: Invalid signature received.');
        return res.status(401).json({ message: 'Invalid signature' });
    }
};

export default verifyWebhook;
