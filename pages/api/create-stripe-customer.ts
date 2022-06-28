import initStripe from 'stripe';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

const handler = async (req: any, res: any) => {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    res.status(401).send('You are not authorised to access this endpoint');
    return;
  }
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
  });
  if (!req.body.email) {
    return res.status(400).send('No email provided');
  }
  if (!req.body.id) {
    return res.status(400).send('No id provided');
  }
  const customer = await stripe.customers.create({
    email: req.body.email,
  });
  await supabaseClient
    .from('profile')
    .insert({
      sripe_customer_id: customer.id,
    })
    .eq('email', req.body.id);
  return res.send({ message: `success, customer id is ${customer.id}` });
};

export default handler;
