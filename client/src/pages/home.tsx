import { useState, useEffect } from "react";
import { Calendar, MapPin, Phone, Mail, Clock, ChevronDown, Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertReservationSchema, type InsertReservation } from "@shared/schema";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import heroImage from "@assets/generated_images/elegant_thai_restaurant_interior.png";
import chefImage from "@assets/generated_images/thai_chef_in_kitchen.png";
import padThaiImage from "@assets/generated_images/pad_thai_dish_overhead.png";
import greenCurryImage from "@assets/generated_images/green_curry_dish_overhead.png";
import tomYumImage from "@assets/generated_images/tom_yum_soup_overhead.png";
import mangoStickyRiceImage from "@assets/generated_images/mango_sticky_rice_dessert.png";

const timeSlots = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
  "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM"
];

const popularDishes = [
  {
    name: "Pad Thai",
    description: "Stir-fried rice noodles with fresh sprouts, bean sprouts, crushed peanuts, and lime.",
    price: "$16.95",
    image: padThaiImage
  },
  {
    name: "Green Curry",
    description: "Spicy green curry made with green beans, bamboo shoots, and fresh basil.",
    price: "$17.95",
    image: greenCurryImage
  },
  {
    name: "Tom Yum Soup",
    description: "Hot and sour lemongrass soup with mushrooms and fresh carrots.",
    price: "$9.95",
    image: tomYumImage
  },
  {
    name: "Mango Sticky Rice",
    description: "Sweet sticky rice with ripe mango slices, drizzled with coconut cream.",
    price: "$5.95",
    image: mangoStickyRiceImage
  }
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [date, setDate] = useState<Date>();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const form = useForm<InsertReservation>({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      partySize: 2,
      specialRequests: ""
    }
  });

  const createReservation = useMutation({
    mutationFn: (data: InsertReservation) => 
      apiRequest("POST", "/api/reservations", data),
    onSuccess: () => {
      setSubmitSuccess(true);
      form.reset();
      setDate(undefined);
      toast({
        title: "Reservation Received!",
        description: "We'll contact you shortly to confirm your reservation.",
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    },
    onError: (error: any) => {
      const errorMessage = error?.body?.message || error.message || "Please try again or contact us directly.";
      toast({
        title: "Reservation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  // Handle scroll for sticky navigation with proper cleanup
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const onSubmit = (data: InsertReservation) => {
    createReservation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <h1 className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                isScrolled ? "text-primary" : "text-white"
              }`}>
                KINN
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("hero")}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
                data-testid="link-home"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
                data-testid="link-about"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("menu")}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
                data-testid="link-menu"
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection("reservations")}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
                data-testid="link-reservations"
              >
                Reservations
              </button>
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleTheme}
                className={isScrolled ? "" : "text-white hover:text-primary"}
                data-testid="button-theme-toggle"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleTheme}
                className={isScrolled ? "" : "text-white hover:text-primary"}
                data-testid="button-theme-toggle-mobile"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={isScrolled ? "" : "text-white hover:text-primary"}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-4 py-6 space-y-4">
              <button
                onClick={() => scrollToSection("hero")}
                className="block w-full text-left text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                data-testid="link-home-mobile"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                data-testid="link-about-mobile"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("menu")}
                className="block w-full text-left text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                data-testid="link-menu-mobile"
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection("reservations")}
                className="block w-full text-left text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                data-testid="link-reservations-mobile"
              >
                Reservations
              </button>
              <div className="pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={toggleTheme}
                  className="w-full justify-start gap-2"
                  data-testid="button-theme-toggle-mobile-drawer"
                >
                  {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
            KINN Thai Eatery
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-12 font-light">
            Authentic Thai Flavors in an Elegant Setting
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              size="lg"
              onClick={() => scrollToSection("menu")}
              className="bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-primary transition-all px-8 py-6 text-base sm:text-lg font-medium"
              data-testid="button-view-menu"
            >
              View Menu
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-primary transition-all px-8 py-6 text-base sm:text-lg font-medium"
              data-testid="button-order-online"
            >
              Order Online
            </Button>
            <Button
              size="lg"
              onClick={() => scrollToSection("reservations")}
              className="bg-primary/90 backdrop-blur-md border-2 border-primary text-white hover:bg-primary transition-all px-8 py-6 text-base sm:text-lg font-medium"
              data-testid="button-book-table"
            >
              Book a Table
            </Button>
          </div>
          
          <button
            onClick={() => scrollToSection("about")}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce"
            aria-label="Scroll to About section"
            data-testid="button-scroll-about"
          >
            <ChevronDown className="w-8 h-8 text-white" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 sm:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-muted-foreground max-w-prose">
                <p>
                  KINN Thai Eatery was born from a passion for authentic Thai cuisine and a desire to share 
                  the rich culinary traditions of Thailand with our community. Since opening our doors, 
                  we've been committed to serving dishes that honor traditional recipes while embracing 
                  modern culinary techniques.
                </p>
                <p>
                  Our chef brings over 20 years of experience, having trained in Bangkok before bringing 
                  these time-honored flavors to your table. Every dish is prepared with fresh ingredients, 
                  traditional spices, and the care that Thai cooking deserves.
                </p>
                <p>
                  From our aromatic curries to our perfectly balanced noodle dishes, we invite you to 
                  experience the authentic taste of Thailand in an elegant, welcoming atmosphere.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={chefImage}
                alt="Chef preparing authentic Thai cuisine"
                className="w-full h-auto rounded-md shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section id="menu" className="py-24 sm:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Signature Dishes
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our most beloved creations, crafted with authentic Thai flavors
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            {popularDishes.map((dish, index) => (
              <Card
                key={index}
                className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300"
                data-testid={`card-dish-${index}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {dish.description}
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {dish.price}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              className="px-8"
              data-testid="button-full-menu"
            >
              View Full Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Reservations Section */}
      <section id="reservations" className="py-24 sm:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Reserve Your Table
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join us for an unforgettable dining experience
            </p>
          </div>
          
          {submitSuccess && (
            <div className="mb-8 p-6 bg-primary/10 border border-primary rounded-md text-center">
              <p className="text-primary font-medium" data-testid="text-reservation-success">
                Thank you! Your reservation request has been received. We'll contact you shortly to confirm.
              </p>
            </div>
          )}
          
          <Card className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Calendar */}
                  <div>
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-base font-semibold mb-3">Select Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-start text-left font-normal h-auto py-4 ${
                                    !date && "text-muted-foreground"
                                  }`}
                                  data-testid="button-select-date"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {date ? format(date, "PPP") : "Pick a date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => {
                                  setDate(newDate);
                                  field.onChange(newDate ? format(newDate, "yyyy-MM-dd") : "");
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-base font-semibold">Select Time</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-auto py-4" data-testid="select-time">
                                <SelectValue placeholder="Choose a time slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="partySize"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-base font-semibold">Party Size</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="h-auto py-4" data-testid="select-party-size">
                                <SelectValue placeholder="Number of guests" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? "Guest" : "Guests"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Right Column - Contact Info */}
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="h-auto py-4"
                              data-testid="input-name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              className="h-auto py-4"
                              data-testid="input-email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="(555) 123-4567"
                              className="h-auto py-4"
                              data-testid="input-phone"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Special Requests (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Dietary restrictions, allergies, or special occasions..."
                              className="resize-none min-h-[120px]"
                              data-testid="input-special-requests"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={createReservation.isPending}
                    className="px-12 py-6 text-lg"
                    data-testid="button-submit-reservation"
                  >
                    {createReservation.isPending ? "Submitting..." : "Reserve Table"}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-card-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">KINN Thai Eatery</h3>
              <p className="text-muted-foreground text-sm">
                Authentic Thai cuisine in an elegant setting. Experience the rich flavors of Thailand.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Hours & Location</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>Mon-Fri: 11:00 AM - 2:30 PM, 5:00 PM - 10:00 PM</p>
                    <p>Sat-Sun: 12:00 PM - 10:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>123 Main Street, Downtown, ST 12345</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a 
                    href="tel:+15551234567" 
                    className="hover:text-primary transition-colors"
                    data-testid="link-phone"
                  >
                    (555) 123-4567
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a 
                    href="mailto:info@kinnthaieatery.com" 
                    className="hover:text-primary transition-colors"
                    data-testid="link-email"
                  >
                    info@kinnthaieatery.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-card-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} KINN Thai Eatery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
