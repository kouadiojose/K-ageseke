import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Product, CartItem } from "@/lib/types";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ShoppingCart, X, Search, Package } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/i18n";

interface CartItemWithCustomPrice extends CartItem {
  customPrice?: number;
}

export default function Marketplace() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const [cart, setCart] = useState<CartItemWithCustomPrice[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customPrice, setCustomPrice] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", language],
    queryFn: async () => {
      const res = await fetch(`/api/products?lang=${language}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  const openPriceModal = (product: Product) => {
    setSelectedProduct(product);
    setCustomPrice(product.price);
  };

  const addToCart = (product: Product, priceOverride?: number) => {
    const finalPrice = priceOverride || parseFloat(product.price);

    setCart((prev) => {
      const existingItem = prev.find(
        (item) => item.productId === product.id && item.customPrice === finalPrice
      );
      if (existingItem) {
        return prev.map((item) =>
          item.productId === product.id && item.customPrice === finalPrice
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity: 1, product, customPrice: finalPrice }];
    });

    toast({
      title: t("marketplace.productAdded"),
      description: t("marketplace.productAddedDesc")
        .replace("{name}", product.name)
        .replace("{price}", finalPrice.toFixed(2)),
    });
  };

  const handleAddToCartWithPrice = () => {
    if (!selectedProduct) return;
    const priceValue = parseFloat(customPrice);
    const minPrice = parseFloat(selectedProduct.price);
    if (isNaN(priceValue) || priceValue < minPrice) {
      toast({
        title: t("marketplace.invalidPrice"),
        description: t("marketplace.invalidPriceDesc").replace("{min}", minPrice.toFixed(2)),
        variant: "destructive",
      });
      return;
    }
    addToCart(selectedProduct, priceValue);
    setSelectedProduct(null);
    setCustomPrice("");
  };

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () =>
    cart.reduce((total, item) => {
      const price = item.customPrice || parseFloat(item.product?.price || "0");
      return total + price * item.quantity;
    }, 0);

  const handleViewCart = () => {
    if (cart.length === 0) {
      toast({ title: t("marketplace.emptyCart"), description: t("marketplace.emptyCartDesc"), variant: "destructive" });
      return;
    }
    const cartWithProducts = cart.map((item) => ({
      ...item,
      product: products?.find((p) => p.id === item.productId),
    }));
    localStorage.setItem("cart", JSON.stringify(cartWithProducts));
    setLocation("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-2">{t("marketplace.title")}</h1>
              <p className="text-gray-200">
                {language === "fr"
                  ? "Achetez des produits pour vos proches en Afrique"
                  : "Buy products for your loved ones in Africa"}
              </p>
            </div>
            <Button className="bg-secondary hover:bg-secondary/90 text-white relative shrink-0 shadow-lg" onClick={handleViewCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t("marketplace.viewCart")} ({getTotalItems()})
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5">{getTotalItems()}</Badge>
              )}
            </Button>
          </div>

          {/* Search */}
          <div className="mt-6 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={language === "fr" ? "Rechercher un produit..." : "Search for a product..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-52 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {searchQuery && (
              <p className="text-sm text-gray-500 mb-4">
                {filteredProducts.length} {language === "fr" ? "produit(s) trouvé(s)" : "product(s) found"}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white group">
                  <div className="h-52 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="text-gray-300 flex flex-col items-center">
                        <Package className="h-12 w-12 mb-2" />
                        <span className="text-xs">{language === "fr" ? "Image bientôt" : "Image coming"}</span>
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge className="bg-red-500 text-white text-sm">{t("marketplace.outOfStock")}</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    {product.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>}
                    <div className="mb-4">
                      <span className="text-xs text-gray-500 block">{t("marketplace.priceFrom")}</span>
                      <span className="text-xl font-bold text-primary">{parseFloat(product.price).toFixed(2)} <span className="text-sm">CAD</span></span>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={() => openPriceModal(product)} disabled={!product.inStock}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.inStock ? t("marketplace.addToCart") : t("marketplace.outOfStock")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? (language === "fr" ? "Aucun résultat" : "No results") : t("marketplace.noProducts")}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? (language === "fr" ? `Aucun produit ne correspond à "${searchQuery}"` : `No product matches "${searchQuery}"`)
                : t("marketplace.noProductsText")}
            </p>
            {searchQuery && (
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                {language === "fr" ? "Effacer la recherche" : "Clear search"}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Mobile cart bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden z-40">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">{t("marketplace.total")} </span>
              <span className="font-bold text-lg">{getTotalPrice().toFixed(2)} CAD</span>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleViewCart}>
              {t("marketplace.order")} ({getTotalItems()})
            </Button>
          </div>
        </div>
      )}

      {/* Price modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{t("marketplace.addToCart")}</h2>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedProduct(null); setCustomPrice(""); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-500">{t("marketplace.startingFrom")} {parseFloat(selectedProduct.price).toFixed(2)} CAD</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-price">{t("marketplace.supportMore")}</Label>
                  <Input
                    id="custom-price"
                    type="number"
                    step="0.01"
                    min={selectedProduct.price}
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder={`Minimum ${parseFloat(selectedProduct.price).toFixed(2)}`}
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500">{t("marketplace.supportDescription")}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => { setSelectedProduct(null); setCustomPrice(""); }} className="flex-1">
                  {t("marketplace.cancel")}
                </Button>
                <Button
                  onClick={handleAddToCartWithPrice}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  disabled={!customPrice || parseFloat(customPrice) < parseFloat(selectedProduct.price)}
                >
                  {t("marketplace.addToCart")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
