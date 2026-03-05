const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-7713424340741840-022714-4f3ad3735a4806ab73715a820f6f06ec-3232695568',
});

async function test() {
    try {
        const preference = new Preference(client);

        const preferenceData = {
            items: [
                {
                    id: 'test-1',
                    title: 'Test Product',
                    description: 'Test Description',
                    picture_url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                    category_id: 'beauty',
                    quantity: 1,
                    unit_price: 100,
                }
            ],
            back_urls: {
                success: 'http://localhost:3000/success',
                failure: 'http://localhost:3000/failure',
                pending: 'http://localhost:3000/pending',
            },


        };

        const response = await preference.create({ body: preferenceData });
        console.log('Success:', response.id);
    } catch (error) {
        console.error('Error Message:', error.message);
        console.error('Error Status:', error.status);
        if (error.cause && error.cause.message) {
            console.error('Error Cause Message:', error.cause.message);
        }
        if (error.cause && error.cause.status) {
            console.error('Error Cause Status:', error.cause.status);
        }
        // Log the whole error object but carefully
        console.log('Full Error:', JSON.stringify(error, null, 2));
    }
}

test();
