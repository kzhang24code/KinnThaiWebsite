import { useState, useEffect } from "react";
import { Link, useSearch, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import { ChevronLeft, Calendar, Clock, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertReservationSchema, type InsertReservation } from "@shared/schema";

export default function Reservation() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  
  const handleBackToReservations = () => {
    setLocation("/");
    setTimeout(() => {
      const reservationsSection = document.getElementById("reservations");
      if (reservationsSection) {
        reservationsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  
  const dateParam = params.get("date") || "";
  const timeParam = params.get("time") || "";
  const partySizeParam = parseInt(params.get("partySize") || "2", 10);
  
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const parsedDate = dateParam ? parse(dateParam, "yyyy-MM-dd", new Date()) : null;
  const formattedDate = parsedDate ? format(parsedDate, "EEEE, MMMM d, yyyy") : "";

  const form = useForm<InsertReservation>({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: dateParam,
      time: timeParam,
      partySize: partySizeParam,
      specialRequests: ""
    }
  });

  useEffect(() => {
    if (dateParam) form.setValue("date", dateParam);
    if (timeParam) form.setValue("time", timeParam);
    if (partySizeParam) form.setValue("partySize", partySizeParam);
  }, [dateParam, timeParam, partySizeParam, form]);

  const createReservation = useMutation({
    mutationFn: (data: InsertReservation) => 
      apiRequest("POST", "/api/reservations", data),
    onSuccess: () => {
      setSubmitSuccess(true);
      toast({
        title: "Reservation Submitted!",
        description: "We'll contact you shortly to confirm your reservation.",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertReservation) => {
    createReservation.mutate(data);
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-lg w-full p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
            Reservation Confirmed!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your reservation request. We'll contact you shortly to confirm the details.
          </p>
          <div className="bg-muted/50 rounded-md p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-foreground">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium text-foreground">{timeParam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Party Size:</span>
                <span className="font-medium text-foreground">{partySizeParam} {partySizeParam === 1 ? "Guest" : "Guests"}</span>
              </div>
            </div>
          </div>
          <Link href="/">
            <Button size="lg" className="w-full" data-testid="button-back-home">
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <Button 
          variant="ghost" 
          className="mb-8" 
          onClick={handleBackToReservations}
          data-testid="button-back"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Reservations
        </Button>

        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Complete Your Reservation
          </h1>
          <p className="text-lg text-muted-foreground">
            Please fill in your details to confirm your booking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                Reservation Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">{formattedDate || "Not selected"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">{timeParam || "Not selected"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Party Size</p>
                    <p className="font-medium text-foreground">{partySizeParam} {partySizeParam === 1 ? "Guest" : "Guests"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-serif font-bold text-primary">KINN Thai Eatery</p>
                    <p className="text-sm text-muted-foreground">100 Foundry Drive Ste 17</p>
                    <p className="text-sm text-muted-foreground">West Lafayette, IN 47906</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8">
              <h2 className="font-semibold text-lg text-foreground mb-6">Your Details</h2>
              
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
                            placeholder="(765) 555-0123"
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
                            placeholder="Any dietary restrictions, allergies, or special occasions?"
                            className="min-h-[100px] resize-none"
                            data-testid="input-special-requests"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    disabled={createReservation.isPending}
                    className="w-full"
                    data-testid="button-submit-reservation"
                  >
                    {createReservation.isPending ? "Submitting..." : "Confirm Reservation"}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
