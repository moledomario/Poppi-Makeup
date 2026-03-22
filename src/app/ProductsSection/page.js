import { Suspense } from 'react';
import ProductsPage from "./ProductsPage";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 border-4 border-[#f790b1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando productos...</p>
        </div>
      }>
        <ProductsPage />
      </Suspense>
      <Footer />
    </>
  );
}
