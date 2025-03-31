
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content: "I found my dream home in just two weeks using this platform. The map feature made it so easy to visualize where properties were located relative to my work.",
      author: "Sarah Johnson",
      role: "Home Buyer",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      initials: "SJ"
    },
    {
      id: 2,
      content: "As a real estate agent, this platform has transformed how I connect with clients. The tools are intuitive and the response rates are fantastic.",
      author: "Michael Chen",
      role: "Real Estate Agent",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      initials: "MC"
    },
    {
      id: 3,
      content: "The filtering options helped us narrow down exactly what we wanted. We ended up finding a property that exceeded our expectations but stayed within our budget.",
      author: "Jessica Rivera",
      role: "First-time Buyer",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      initials: "JR"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <p className="text-muted-foreground mb-6 flex-grow">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
