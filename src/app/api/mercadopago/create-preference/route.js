import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.NEXT_PUBLIC_MP_ACCES_TOKEN,
});

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, customer, shipping, total } = body;

        // Crear la preferencia de pago
        const preference = new Preference(client);

        const preferenceData = {
            items: items.map(item => ({
                id: item.productId,
                title: item.name,
                description: item.color ? `Color: ${item.color.name}` : '',
                picture_url: item.image,
                category_id: 'beauty',
                quantity: item.quantity,
                unit_price: parseFloat(item.price),
            })),
            payer: {
                name: customer.name,
                email: customer.email,
                phone: {
                    number: customer.phone,
                },
                address: shipping.cost > 0 ? {
                    street_name: customer.address || '',
                    zip_code: customer.postalCode || '',
                } : undefined,
            },
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success`,
                failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/failure`,
                pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/pending`,
            },

            payment_methods: {
                excluded_payment_types: [],
                installments: 12, // Hasta 12 cuotas
            },
            shipments: {
                cost: parseFloat(shipping.cost),
                mode: shipping.cost > 0 ? 'custom' : 'not_specified',
            },
            statement_descriptor: 'POPPIMAKECUP',
            external_reference: `ORDER-${Date.now()}`, // ID único de tu orden
            notification_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/webhooks/mercadopago`,
            metadata: {
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                shipping_address: customer.address || 'Retiro en tienda',
                shipping_zone: shipping.zone,
                shipping_notes: customer.notes || '',
            },
        };

        const response = await preference.create({ body: preferenceData });

        return NextResponse.json({
            id: response.id,
            init_point: response.init_point, // URL para redirigir al usuario
            sandbox_init_point: response.sandbox_init_point,
        });

    } catch (error) {
        console.error('Error creating Mercado Pago preference:', error);
        return NextResponse.json(
            { error: 'Error al crear la preferencia de pago', details: error.message },
            { status: 500 }
        );
    }
}