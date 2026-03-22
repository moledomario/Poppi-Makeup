import { Suspense } from 'react';
import CheckoutPendingPage from "../../layout/checkoutLayout/pending";

export default function Page() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <CheckoutPendingPage />
        </Suspense>
    );
}