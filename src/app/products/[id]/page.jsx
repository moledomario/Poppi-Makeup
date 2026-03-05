import ProductDetailPage from '../../ProductDetail/ProductDetailPage';
import Footer from '../../layout/Footer';
import Header from '../../layout/Header';

export default async function Page({ params }) {
    const { id } = await params;
    return <>
        <Header />
        <ProductDetailPage productId={id} />
        <Footer />
    </>;
}