import React, {useState, useEffect} from 'react';
// import {useStripe} from '@stripe/react-stripe-js';

const PaymentStatus = ({addsub}) => {
//   const stripe = useStripe();
  const [message, setMessage] = useState("loading");

  useEffect(() => {
    // if (!stripe) {
    //   return;
    // }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const status = new URLSearchParams(window.location.search).get(
      'redirect_status'
    );

    // Retrieve the PaymentIntent
    // stripe
    //   .retrievePaymentIntent(clientSecret)
    //   .then(({paymentIntent}) => {
    //     // Inspect the PaymentIntent `status` to indicate the status of the payment
    //     // to your customer.
    //     //
    //     // Some payment methods will [immediately succeed or fail][0] upon
    //     // confirmation, while others will first enter a `processing` state.
    //     //
    //     // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
    //     switch (paymentIntent.status) {
    //       case 'succeeded':
    //         setMessage('Success! Payment received.');
    //         addsub();
    //         break;

    //       case 'processing':
    //         setMessage("Payment processing. We'll update you when payment is received.");
    //         break;

    //       case 'requires_payment_method':
    //         // Redirect your user back to your payment page to attempt collecting
    //         // payment again
    //         setMessage('Payment failed. Please try another payment method.');
    //         break;

    //       default:
    //         setMessage('Something went wrong.');
    //         break;
    //     }
    //   });
    if(status === 'succeeded'){
        setMessage('Success! Payment received.');
        addsub();
    }
  }, []);


  return (
  <>
  {message}
  <p>Click on My TODO List to go to Home Page</p>
  </>
  );
};

export default PaymentStatus;

// http://localhost:3000/makepayment/done?payment_intent=pi_3OS4QnSEwGxLhH4W1LMAgEj7&payment_intent_client_secret=pi_3OS4QnSEwGxLhH4W1LMAgEj7_secret_ofTZrIx9mIiiK3YjSWuydkcKk&redirect_status=succeeded