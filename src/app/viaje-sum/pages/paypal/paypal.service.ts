import { Router } from 'express';
import Stripe from 'stripe';



const stripe = new Stripe('sk_test_51QDKqHLAh0cR3je8QOD0HpbR09g2aORGAgvD71wmpMpiR8R2F9TWlbH9PGT9kMW8akHl5ALgkHGtaYBOU4To5Ja400ot7xWbHQ',);
const router = Router();

router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: 'Acceso a Mi Gasto Seguro',
                        },
                        unit_amount: 25000, // 250 MXN en centavos
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:4200/success',
            cancel_url: 'http://localhost:4200/cancel',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;