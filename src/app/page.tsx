import Header from "@/features/landing/components/header";
import Hero from "@/features/landing/components/hero";
import Stats from "@/features/landing/components/stats";
import Features from "@/features/landing/components/features";
import Workflow from "@/features/landing/components/workflow";
import Testimonials from "@/features/landing/components/testimonials";
import WhyChooseUs from "@/features/landing/components/why-choose-us";
import FAQ from "@/features/landing/components/faq";
import CTA from "@/features/landing/components/cta";
import Footer from "@/features/landing/components/footer";

export const metadata = {
  title: "Home",
};

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Stats />
      <Features />
      <Workflow />
      <Testimonials />
      <WhyChooseUs />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
