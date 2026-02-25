import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import TrustSecurity from "@/components/trust-security";
import Footer from "@/components/footer";
import ServicesSection from "@/components/services-section";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";

function StatsSection() {
  const { language } = useLanguage();

  const stats = [
    { value: "10+", label: language === "fr" ? "Pays desservis" : "Countries served", icon: "fas fa-globe-africa" },
    { value: "24/7", label: language === "fr" ? "Support client" : "Customer support", icon: "fas fa-headset" },
    { value: "0%", label: language === "fr" ? "Frais cachés" : "Hidden fees", icon: "fas fa-hand-holding-usd" },
    { value: "48h", label: language === "fr" ? "Livraison max" : "Max delivery", icon: "fas fa-shipping-fast" },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <i className={`${stat.icon} text-primary text-xl`}></i>
              </div>
              <p className="text-3xl font-bold text-primary font-poppins">{stat.value}</p>
              <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { language } = useLanguage();

  const steps = [
    {
      number: "1",
      icon: "fas fa-user-plus",
      title: language === "fr" ? "Créez votre compte" : "Create your account",
      description: language === "fr"
        ? "Inscrivez-vous gratuitement en quelques minutes"
        : "Sign up for free in just a few minutes",
    },
    {
      number: "2",
      icon: "fas fa-hand-pointer",
      title: language === "fr" ? "Choisissez votre service" : "Choose your service",
      description: language === "fr"
        ? "Transfert d'argent ou achat sur le marketplace"
        : "Money transfer or marketplace purchase",
    },
    {
      number: "3",
      icon: "fas fa-credit-card",
      title: language === "fr" ? "Payez en toute sécurité" : "Pay securely",
      description: language === "fr"
        ? "Paiement sécurisé par carte via Square"
        : "Secure card payment via Square",
    },
    {
      number: "4",
      icon: "fas fa-check-circle",
      title: language === "fr" ? "C'est fait !" : "It's done!",
      description: language === "fr"
        ? "Votre proche reçoit l'argent ou le produit"
        : "Your loved one receives the money or product",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
            {language === "fr" ? "Comment ça marche ?" : "How does it work?"}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === "fr"
              ? "Un processus simple en 4 étapes pour envoyer de l'argent ou acheter pour vos proches"
              : "A simple 4-step process to send money or buy for your loved ones"}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gray-200"></div>
              )}
              <div className="relative z-10">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  <i className={`${step.icon} text-primary text-2xl`}></i>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-secondary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-poppins">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/fonctionnement">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
              {language === "fr" ? "En savoir plus" : "Learn more"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { language } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
          {language === "fr"
            ? "Prêt à connecter avec vos proches ?"
            : "Ready to connect with your loved ones?"}
        </h2>
        <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
          {language === "fr"
            ? "Rejoignez K-Ageseke et commencez à envoyer de l'argent ou à acheter des produits pour votre famille en Afrique."
            : "Join K-Ageseke and start sending money or buying products for your family in Africa."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg">
              {language === "fr" ? "Créer un compte gratuit" : "Create a free account"}
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 text-lg font-semibold"
            >
              {language === "fr" ? "Nous contacter" : "Contact us"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <StatsSection />
      <ServicesSection />
      <HowItWorksSection />
      <TrustSecurity />
      <CTASection />
      <Footer />
    </div>
  );
}
