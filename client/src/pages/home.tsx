import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronLeft, ChevronRight, Menu, X, Moon, Sun, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertReservationSchema, type InsertReservation } from "@shared/schema";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfToday, getDay } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import abstractBgImage from "@assets/generated_images/abstract_red_white_neutral_gradient.png";
import chefImage from "@assets/generated_images/thai_chef_in_kitchen.png";
import basilFriedRiceImage from "@assets/dish-basil-fried-rice.png";
import khaoSoiImage from "@assets/dish-khao-soi.png";
import padThaiShrimpImage from "@assets/dish-pad-thai-shrimp.png";
import springRollsImage from "@assets/dish-spring-rolls.png";

const timeSlots = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM",
  "7:30 PM", "8:00 PM"
];

const popularDishes = [
  {
    name: "Basil Fried Rice",
    description: "Aromatic fried rice with Thai basil, stir-fried beef, and topped with a sunny-side egg.",
    price: "$16.95",
    image: basilFriedRiceImage
  },
  {
    name: "Khao Soi",
    description: "Northern Thai curry noodles with crispy egg noodles, tender meat, and fresh herbs.",
    price: "$17.95",
    image: khaoSoiImage
  },
  {
    name: "Pad Thai Shrimp",
    description: "Classic stir-fried rice noodles with grilled jumbo shrimp, bean sprouts, and lime.",
    price: "$18.95",
    image: padThaiShrimpImage
  },
  {
    name: "Crispy Spring Rolls",
    description: "Golden fried spring rolls filled with savory vegetables, served with sweet chili sauce.",
    price: "$8.95",
    image: springRollsImage
  }
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // Reservation wizard state
  const [wizardStep, setWizardStep] = useState<"time" | "client">("time");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [partySize, setPartySize] = useState(2);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      setSelectedDate(undefined);
      setSelectedTime("");
      setPartySize(2);
      setWizardStep("time");
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

  // Calendar helpers
  const today = startOfToday();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateSelect = (day: Date) => {
    if (!isBefore(day, today)) {
      setSelectedDate(day);
      form.setValue("date", format(day, "yyyy-MM-dd"));
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    form.setValue("time", time);
  };

  const handlePartySizeChange = (size: number) => {
    setPartySize(size);
    form.setValue("partySize", size);
  };

  const canProceedToClient = selectedDate && selectedTime;

  const handleNextStep = () => {
    if (canProceedToClient) {
      setWizardStep("client");
    }
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

      {/* Hero Section with Abstract Background */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${abstractBgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
        
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
            <Link href="/menu">
              <Button
                size="lg"
                variant="outline"
                className="px-8"
                data-testid="button-full-menu"
              >
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reservations Section - New Wizard Design */}
      <section id="reservations" className="py-24 sm:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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
          
          <Card className="overflow-hidden">
            {/* Step Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setWizardStep("time")}
                className={`flex-1 py-4 text-center font-semibold transition-colors ${
                  wizardStep === "time"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                data-testid="tab-time"
              >
                Time
              </button>
              <button
                onClick={() => canProceedToClient && setWizardStep("client")}
                className={`flex-1 py-4 text-center font-semibold transition-colors ${
                  wizardStep === "client"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                } ${!canProceedToClient ? "cursor-not-allowed opacity-50" : ""}`}
                disabled={!canProceedToClient}
                data-testid="tab-client"
              >
                Client
              </button>
            </div>
            
            <div className="p-6 lg:p-8">
              {wizardStep === "time" ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left Sidebar */}
                  <div className="lg:col-span-1 space-y-8">
                    <div className="p-4 bg-muted/50 rounded-md">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2">Book a Table</h3>
                      <p className="text-sm text-muted-foreground">Select a date and time for your reservation</p>
                    </div>
                    
                    {/* Party Size */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Party Size
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                          <button
                            key={size}
                            onClick={() => handlePartySizeChange(size)}
                            className={`w-10 h-10 rounded-md font-medium transition-colors ${
                              partySize === size
                                ? "bg-primary text-white"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                            data-testid={`button-party-size-${size}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">For larger parties, please call us</p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-md">
                      <h3 className="font-serif text-lg font-bold text-primary">KINN THAI</h3>
                      <p className="text-xs text-muted-foreground mt-1">123 Main Street, Downtown</p>
                    </div>
                  </div>
                  
                  {/* Main Calendar Area */}
                  <div className="lg:col-span-3">
                    {/* Current Time Display */}
                    <div className="text-right text-sm text-muted-foreground mb-4">
                      Our time: {format(new Date(), "h:mm a")} Local Time
                    </div>
                    
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={goToPrevMonth}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
                        data-testid="button-prev-month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Prev Month
                      </button>
                      <h3 className="font-semibold text-lg text-foreground">
                        {format(currentMonth, "MMMM yyyy")}
                      </h3>
                      <button
                        onClick={goToNextMonth}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
                        data-testid="button-next-month"
                      >
                        Next Month
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="border rounded-md overflow-hidden mb-8">
                      {/* Day Headers */}
                      <div className="grid grid-cols-7 bg-muted/50">
                        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                          <div
                            key={day}
                            className={`py-3 text-center text-xs font-semibold ${
                              day === "SAT" || day === "SUN" ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar Days */}
                      <div className="grid grid-cols-7">
                        {/* Empty cells for days before the month starts */}
                        {Array.from({ length: startDayOfWeek }).map((_, index) => (
                          <div key={`empty-${index}`} className="py-4 text-center border-t" />
                        ))}
                        
                        {/* Actual days */}
                        {daysInMonth.map((day) => {
                          const isToday = isSameDay(day, today);
                          const isPast = isBefore(day, today);
                          const isSelected = selectedDate && isSameDay(day, selectedDate);
                          const dayOfWeek = getDay(day);
                          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                          
                          return (
                            <button
                              key={day.toISOString()}
                              onClick={() => handleDateSelect(day)}
                              disabled={isPast}
                              className={`py-4 text-center border-t transition-colors ${
                                isPast
                                  ? "text-muted-foreground/40 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-primary text-white font-bold"
                                  : isToday
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : isWeekend
                                  ? "text-primary hover:bg-primary/10"
                                  : "text-foreground hover:bg-muted"
                              }`}
                              data-testid={`button-date-${format(day, "yyyy-MM-dd")}`}
                            >
                              {format(day, "d")}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Time Slots */}
                    <div>
                      <h4 className="font-semibold text-lg text-foreground mb-4">Available start times</h4>
                      <div className="flex flex-wrap gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`px-4 py-3 rounded-md border-2 font-medium transition-colors ${
                              selectedTime === time
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-primary/30 text-foreground hover:border-primary hover:bg-primary/5"
                            }`}
                            data-testid={`button-time-${time.replace(/\s/g, "-").replace(":", "-")}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                        <div className="w-3 h-3 rounded-full bg-primary/30" />
                        <span>- Available</span>
                      </div>
                    </div>
                    
                    {/* Next Button */}
                    <div className="flex justify-end mt-8">
                      <Button
                        onClick={handleNextStep}
                        disabled={!canProceedToClient}
                        size="lg"
                        className="px-8"
                        data-testid="button-next-step"
                      >
                        Continue to Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Client Details Step */
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left Sidebar - Summary */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="p-4 bg-muted/50 rounded-md">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-4">Your Reservation</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <p className="font-medium text-foreground">
                            {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "-"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <p className="font-medium text-foreground">{selectedTime || "-"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Party Size:</span>
                          <p className="font-medium text-foreground">{partySize} {partySize === 1 ? "Guest" : "Guests"}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => setWizardStep("time")}
                        data-testid="button-edit-time"
                      >
                        Edit Selection
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-md">
                      <h3 className="font-serif text-lg font-bold text-primary">KINN THAI</h3>
                      <p className="text-xs text-muted-foreground mt-1">123 Main Street, Downtown</p>
                    </div>
                  </div>
                  
                  {/* Client Form */}
                  <div className="lg:col-span-3">
                    <h3 className="font-semibold text-lg text-foreground mb-6">Your Details</h3>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="John Doe"
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
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    data-testid="input-email"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="(555) 123-4567"
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
                              <FormLabel>Special Requests (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Dietary restrictions, allergies, or special occasions..."
                                  className="resize-none min-h-[100px]"
                                  data-testid="input-special-requests"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex gap-4 justify-end pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setWizardStep("time")}
                            data-testid="button-back-step"
                          >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            size="lg"
                            disabled={createReservation.isPending}
                            className="px-8"
                            data-testid="button-submit-reservation"
                          >
                            {createReservation.isPending ? "Submitting..." : "Confirm Reservation"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              )}
            </div>
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
