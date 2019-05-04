import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: 'https://getcubee.myshopify.com',
  storefrontAccessToken: '8be4837e71547c75a2e463dcf5db6a99'
});

// Create an empty checkout
client.checkout.create().then((checkout) => {
  // Do something with the checkout
  console.log(checkout);
});
