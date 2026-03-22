import { Suspense } from 'react';
import CheckoutFailurePage from "../../layout/checkoutLayout/failure";

export default function Page() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <CheckoutFailurePage />
        </Suspense>
    );
}