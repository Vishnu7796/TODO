import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckOutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51ORgHTSEwGxLhH4WyjmmwL7T8xsePotNC7Q6pulSmHp07F4TKMER2ynFQgr7A78iPj9f1V9pgGZaZGy3U1T0rsJS00wdkzekFt');

function Payment({ clientSecret}) {
  console.log('f');
  console.log(clientSecret);
  const options = {
    // passing the client secret obtained in step 3
    clientSecret: clientSecret,
    // Fully customizable with appearance API.
    appearance: {theme : 'night'},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default Payment;