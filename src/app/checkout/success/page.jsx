import { Suspense } from 'react';
import CheckoutSuccessPage from "../../layout/checkoutLayout/Succes";

export default function Page() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <CheckoutSuccessPage />
        </Suspense>
    );
}