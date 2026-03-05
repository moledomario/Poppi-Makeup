'use client';

import { useParams } from 'next/navigation';
import ProductForm from '../../../../../Components/ProductForm';

export default function Page() {
    const params = useParams();
    const id = params?.id;

    if (!id) {
        return (
            <div className="p-6">
                <div className="text-center py-16">
                    <p className="text-red-600">Error: ID de producto no encontrado</p>
                </div>
            </div>
        );
    }

    return <ProductForm isEdit={true} recordId={id} />;
}