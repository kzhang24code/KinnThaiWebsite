import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock, ChevronLeft, ChevronRight, Menu, X, Moon, Sun, Users, ExternalLink, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SiDoordash, SiUbereats, SiGrubhub } from "react-icons/si";
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
import heroBgImage from "@assets/generated_images/elegant_red_watercolor_gradient.png";
import basilFriedRiceImage from "@assets/dish-basil-fried-rice.png";
import khaoSoiImage from "@assets/dish-khao-soi.png";
import padThaiShrimpImage from "@assets/dish-pad-thai-shrimp.png";
import springRollsImage from "@assets/dish-spring-rolls.png";

// Animated Tube Man Component - matches the real inflatable mascot
function TubeMan() {
  return (
    <div className="relative w-20 h-48 sm:w-28 sm:h-64">
      <svg
        viewBox="0 0 120 220"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {/* Main group that sways */}
        <g style={{ animation: 'tubeWave 1.2s ease-in-out infinite', transformOrigin: '60px 200px' }}>
          
          {/* Black hair/streamers on top */}
          <g style={{ animation: 'hairWave 0.4s ease-in-out infinite', transformOrigin: '60px 25px' }}>
            <path d="M 50 25 Q 45 5 40 15" stroke="#222" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 55 22 Q 52 0 48 10" stroke="#222" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 60 20 Q 60 -2 58 8" stroke="#222" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 65 22 Q 68 0 72 10" stroke="#222" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 70 25 Q 75 5 80 15" stroke="#222" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
          
          {/* Head - rounder */}
          <ellipse cx="60" cy="45" rx="20" ry="22" fill="#dc2626" />
          
          {/* Eyes - white ovals */}
          <ellipse cx="52" cy="40" rx="6" ry="7" fill="white" />
          <ellipse cx="68" cy="40" rx="6" ry="7" fill="white" />
          
          {/* Pupils */}
          <circle cx="54" cy="41" r="3" fill="#222" />
          <circle cx="70" cy="41" r="3" fill="#222" />
          
          {/* Big smile */}
          <path
            d="M 48 55 Q 60 70 72 55"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Body - tall cylinder tube */}
          <rect x="42" y="65" width="36" height="110" rx="18" fill="#dc2626" />
          
          {/* Left Arm - tube shape extending outward */}
          <g style={{ animation: 'leftArm 0.5s ease-in-out infinite', transformOrigin: '42px 80px' }}>
            <rect x="-15" y="70" width="60" height="16" rx="8" fill="#dc2626" transform="rotate(-45 42 78)" />
          </g>
          
          {/* Right Arm - tube shape extending outward */}
          <g style={{ animation: 'rightArm 0.5s ease-in-out infinite 0.25s', transformOrigin: '78px 80px' }}>
            <rect x="75" y="70" width="60" height="16" rx="8" fill="#dc2626" transform="rotate(45 78 78)" />
          </g>
        </g>
        
        {/* Black base/blower - stays still */}
        <ellipse cx="60" cy="178" rx="24" ry="8" fill="#222" />
        <rect x="36" y="178" width="48" height="25" fill="#222" />
        <ellipse cx="60" cy="203" rx="24" ry="8" fill="#1a1a1a" />
      </svg>
      
      <style>{`
        @keyframes tubeWave {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes hairWave {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes leftArm {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes rightArm {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(-25deg); }
        }
      `}</style>
    </div>
  );
}

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
  const [orderModalOpen, setOrderModalOpen] = useState(false);
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
          style={{ backgroundImage: `url(${heroBgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
        
        {/* Tube Man Mascot - bottom right corner, outside content */}
        <div className="absolute bottom-8 right-4 sm:right-8 lg:right-16 z-20 opacity-90 hidden sm:block">
          <TubeMan />
        </div>
        
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
              className="bg-primary text-white border-2 border-primary hover:bg-primary/90 transition-all px-8 py-6 text-base sm:text-lg font-semibold shadow-lg"
              data-testid="button-view-menu"
            >
              View Menu
            </Button>
            <Button
              size="lg"
              onClick={() => setOrderModalOpen(true)}
              className="bg-primary text-white border-2 border-primary hover:bg-primary/90 transition-all px-8 py-6 text-base sm:text-lg font-semibold shadow-lg"
              data-testid="button-order-online"
            >
              Order Online
            </Button>
            <Button
              size="lg"
              onClick={() => scrollToSection("reservations")}
              className="bg-primary text-white border-2 border-primary hover:bg-primary/90 transition-all px-8 py-6 text-base sm:text-lg font-semibold shadow-lg"
              data-testid="button-book-table"
            >
              Book a Table
            </Button>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section id="menu" className="py-24 sm:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Signature Dishes
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore our most beloved creations, crafted with authentic Thai flavors
            </p>
            
            {/* Prominent View Full Menu Button */}
            <Link href="/menu">
              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 px-10 py-6 text-lg font-semibold shadow-lg"
                data-testid="button-full-menu-top"
              >
                View Full Menu
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
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
                      <p className="text-xs text-muted-foreground mt-1">100 Foundry Drive Ste 17, West Lafayette</p>
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
                            className="py-3 text-center text-xs font-semibold text-foreground"
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
                                  ? "bg-muted font-semibold text-foreground"
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
                      <p className="text-xs text-muted-foreground mt-1">100 Foundry Drive Ste 17, West Lafayette</p>
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
                                  placeholder="(765) 607-1751"
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

      {/* Location Section with Google Maps */}
      <section id="location" className="py-24 sm:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Find Us
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Visit us for an authentic Thai dining experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Map */}
            <div className="rounded-md overflow-hidden shadow-lg h-[400px] lg:h-[450px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.5!2d-86.9175!3d40.4317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8812e2b5d7b5d5d5%3A0x0!2s100+Foundry+Dr+Ste+17%2C+West+Lafayette%2C+IN+47906!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KINN Thai Eatery Location"
                data-testid="map-google"
              />
            </div>
            
            {/* Location Info */}
            <div className="flex flex-col justify-center space-y-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-md">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">Address</h3>
                    <p className="text-muted-foreground">100 Foundry Drive Ste 17</p>
                    <p className="text-muted-foreground">West Lafayette, IN 47906</p>
                    <a
                      href="https://maps.google.com/?q=100+Foundry+Drive+Ste+17+West+Lafayette+IN+47906"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline mt-2 text-sm font-medium"
                      data-testid="link-get-directions"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </a>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-md">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Hours</h3>
                    <div className="space-y-1 text-muted-foreground">
                      <div className="flex justify-between gap-8">
                        <span>Monday - Friday</span>
                        <span>11:00 AM - 10:00 PM</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Saturday - Sunday</span>
                        <span>12:00 PM - 10:00 PM</span>
                      </div>
                    </div>
                    <p className="text-sm text-primary font-medium mt-3">
                      Lunch Special: Weekdays 12:00 - 2:30 PM
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-md">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">Contact</h3>
                    <a
                      href="tel:+17656071751"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      data-testid="link-phone-location"
                    >
                      (765) 607-1751
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Call for reservations or takeout orders
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Order Online Modal */}
      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-center">Order Online</DialogTitle>
            <DialogDescription className="text-center">
              Choose your preferred delivery service
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <a
              href="https://www.doordash.com/store/kinn-thai-eatery"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-md border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
              data-testid="link-doordash"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FF3008] rounded-md flex items-center justify-center">
                  <SiDoordash className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">DoorDash</h3>
                  <p className="text-sm text-muted-foreground">Fast delivery to your door</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            
            <a
              href="https://www.ubereats.com/store/kinn-thai-eatery"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-md border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
              data-testid="link-ubereats"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#06C167] rounded-md flex items-center justify-center">
                  <SiUbereats className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Uber Eats</h3>
                  <p className="text-sm text-muted-foreground">Order with Uber Eats</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            
            <a
              href="https://www.grubhub.com/restaurant/kinn-thai-eatery"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-md border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
              data-testid="link-grubhub"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F63440] rounded-md flex items-center justify-center">
                  <SiGrubhub className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Grubhub</h3>
                  <p className="text-sm text-muted-foreground">Order with Grubhub</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            
            <div className="pt-4 border-t border-border">
              <p className="text-center text-sm text-muted-foreground mb-3">
                Prefer to order directly?
              </p>
              <a
                href="tel:+17656071751"
                className="flex items-center justify-center gap-2 p-3 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
                data-testid="link-call-order"
              >
                <Phone className="w-4 h-4" />
                Call (765) 607-1751
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                  <p>100 Foundry Drive Ste 17, West Lafayette, IN 47906</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a 
                    href="tel:+17656071751" 
                    className="hover:text-primary transition-colors"
                    data-testid="link-phone"
                  >
                    (765) 607-1751
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a 
                    href="mailto:kinnthai.group@gmail.com" 
                    className="hover:text-primary transition-colors"
                    data-testid="link-email"
                  >
                    kinnthai.group@gmail.com
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
