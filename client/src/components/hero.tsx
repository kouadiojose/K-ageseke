import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";

export default function Hero() {
  const { t, language } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white overflow-hidden">
      {/* African pattern background */}
      <div className="absolute inset-0 opacity-10 african-pattern"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              <span className="text-sm text-gray-200">
                {language === "fr" ? "Plateforme active dans 10+ pays" : "Platform active in 10+ countries"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight mb-6">
              {t("hero.title")} <span className="text-secondary">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed max-w-lg">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/k-ageseke">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all shadow-lg"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  {t("hero.transferButton")}
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  {t("hero.marketplaceButton")}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
              <div className="flex items-center space-x-2">
                <i className="fas fa-shield-alt text-secondary"></i>
                <span>{t("hero.secured")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-bolt text-secondary"></i>
                <span>{t("hero.instant")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-globe-africa text-secondary"></i>
                <span>{t("hero.global")}</span>
              </div>
            </div>
          </div>

          <div className="animate-slide-up hidden lg:block">
            {/* Transaction preview card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-gray-800 font-semibold">
                  {t("hero.recentPayment")}
                </h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {t("hero.completed")}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>{t("hero.productName")}</span>
                  <span className="font-medium text-gray-800">
                    {t("hero.meatProduct")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t("hero.amount")}</span>
                  <span className="font-bold text-primary text-lg">50 CAD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t("hero.fees")}</span>
                  <span className="font-medium text-green-600">0 CAD</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-gray-800 font-medium">
                    {t("hero.received")}
                  </span>
                  <span className="font-bold text-secondary text-xl">
                    150 000 BIF
                  </span>
                </div>
              </div>
            </div>

            {/* Small floating card */}
            <div className="bg-white rounded-xl shadow-lg p-4 -mt-4 ml-8 max-w-[200px] transform -rotate-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <i className="fas fa-check text-green-600"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{language === "fr" ? "Envoi rapide" : "Fast delivery"}</p>
                  <p className="text-sm font-bold text-gray-800">24-48h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
