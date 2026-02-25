import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-globe-africa text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold font-poppins">K-Ageseke Group</h3>
                <p className="text-sm text-gray-400">{t("hero.subtitle")}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {language === "fr"
                ? "Plateforme de confiance pour les transferts d'argent et les achats de produits africains. Nous connectons la diaspora africaine avec leur pays d'origine."
                : "Trusted platform for money transfers and African product purchases. We connect the African diaspora with their home countries."}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">
              {language === "fr" ? "Services" : "Services"}
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/k-ageseke" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-paper-plane text-xs mr-2 text-secondary"></i>
                  {language === "fr" ? "Transfert d'argent" : "Money Transfer"}
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-shopping-cart text-xs mr-2 text-secondary"></i>
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/fonctionnement" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-info-circle text-xs mr-2 text-secondary"></i>
                  {t("nav.howItWorks")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-concierge-bell text-xs mr-2 text-secondary"></i>
                  {t("nav.services")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">Support</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-envelope text-xs mr-2 text-secondary"></i>
                  {language === "fr" ? "Nous contacter" : "Contact us"}
                </Link>
              </li>
              <li>
                <Link href="/fonctionnement" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-question-circle text-xs mr-2 text-secondary"></i>
                  FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@k-ageseke.com" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-headset text-xs mr-2 text-secondary"></i>
                  support@k-ageseke.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} K-Ageseke Group by{" "}
            <a href="https://markel-tech.com" className="hover:text-white transition-colors">
              Markel Technology
            </a>
            . {language === "fr" ? "Tous droits réservés." : "All rights reserved."}
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              {language === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {language === "fr" ? "Conditions d'utilisation" : "Terms of Service"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
