import HeroSection from "./layout/heroSection";
import CategoriesSection from "./layout/Categories";
import ProductsList from "./layout/ProductsList";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <CategoriesSection />
      <ProductsList />
      <Footer />
    </>
  );
}
