import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import menuDinnerPage1 from "@assets/menu-dinner-page1.webp";
import menuDinnerPage2 from "@assets/menu-dinner-page2.webp";
import menuLunch from "@assets/menu-lunch.webp";

type MenuTab = "dinner" | "lunch";

export default function Menu() {
  const [activeTab, setActiveTab] = useState<MenuTab>("dinner");
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back-home">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="font-serif text-2xl font-bold text-primary">KINN</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <h2 className="font-serif text-xl font-semibold text-foreground hidden sm:block">Our Menu</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleTheme}
                data-testid="button-theme-toggle-menu"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Tabs */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("dinner")}
              className={`py-4 px-6 font-semibold text-sm sm:text-base transition-colors relative ${
                activeTab === "dinner"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="tab-dinner-menu"
            >
              Dinner Menu
              {activeTab === "dinner" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("lunch")}
              className={`py-4 px-6 font-semibold text-sm sm:text-base transition-colors relative ${
                activeTab === "lunch"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="tab-lunch-menu"
            >
              Lunch Special
              {activeTab === "lunch" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <main className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "dinner" ? (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  Dinner Menu
                </h2>
                <p className="text-muted-foreground">
                  Available daily from 5:00 PM - 10:00 PM
                </p>
              </div>
              
              {/* Dinner Menu Page 1 - Appetizers, Salads, Soups, etc. */}
              <div className="bg-card rounded-md overflow-hidden shadow-lg">
                <img
                  src={menuDinnerPage1}
                  alt="KINN Thai Eatery Dinner Menu - Appetizers, Salads, Soups, Desserts, Sides, and Drinks"
                  className="w-full h-auto"
                  data-testid="img-dinner-menu-page1"
                />
              </div>
              
              {/* Dinner Menu Page 2 - Noodles, Curries, Entrees, etc. */}
              <div className="bg-card rounded-md overflow-hidden shadow-lg">
                <img
                  src={menuDinnerPage2}
                  alt="KINN Thai Eatery Dinner Menu - Noodles, Curries, Entrees, Rice Dishes, and Toppings"
                  className="w-full h-auto"
                  data-testid="img-dinner-menu-page2"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  Lunch Special
                </h2>
                <p className="text-muted-foreground">
                  Weekdays from 12:00 PM - 2:30 PM
                </p>
              </div>
              
              {/* Lunch Menu */}
              <div className="bg-card rounded-md overflow-hidden shadow-lg">
                <img
                  src={menuLunch}
                  alt="KINN Thai Eatery Lunch Special Menu - Weekday specials with curries, noodles, and rice dishes"
                  className="w-full h-auto"
                  data-testid="img-lunch-menu"
                />
              </div>
            </div>
          )}
          
          {/* Info Section */}
          <div className="mt-12 p-6 bg-muted/50 rounded-md text-center">
            <h3 className="font-semibold text-foreground mb-2">Allergy Information</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Menu items may contain or come into contact with wheat, eggs, nuts, and milk. 
              Please ask our staff for more information.
            </p>
            <p className="text-sm text-muted-foreground">
              A gratuity of 18% will be charged for parties over 6.
            </p>
          </div>
          
          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link href="/">
              <Button variant="outline" size="lg" data-testid="button-back-to-home">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
