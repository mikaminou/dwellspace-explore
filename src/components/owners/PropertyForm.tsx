import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePropertyData } from "@/hooks/usePropertyData";
import { usePropertySubmit } from "@/hooks/usePropertySubmit";
import { PropertyFormValues, propertySchema } from "@/data/propertySchema";
import { LocationStep } from "../property-form/LocationStep";
import { BasicInfoStep } from "../property-form/BasicInfoStep";
import { FeaturesStep } from "../property-form/FeaturesStep";
import { MediaStep } from "../property-form/MediaStep";
import { MainNav } from "../MainNav";


const formSteps = [
  { id: "location", label: "Location", icon: "MapPin" },
  { id: "basic", label: "Basic Info", icon: "Home" },
  { id: "features", label: "Features", icon: "Info" },
  { id: "media", label: "Media", icon: "Image" },
];

export function PropertyForm({ id, useGoogleMaps = false }: { id?: string; useGoogleMaps?: boolean }) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState("location");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);

  const { loading, propertyData } = usePropertyData(id);
  const { onSubmit, isSaving } = usePropertySubmit(id);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
  });

  useEffect(() => {
    if (propertyData) {
      form.reset({
        ...propertyData,
        listing_type: propertyData.listing_type as "sale" | "rent",
      });
      setImageUrl(propertyData.image || "");
      setAdditionalImageUrls(propertyData.additionalImages || []);
    }
  }, [propertyData, form]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{id ? "Edit Property" : "Create New Property"}</CardTitle>
              <CardDescription>
                {id ? "Update your property information" : "Fill out the form to list a new property"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={currentStep} onValueChange={setCurrentStep}>
                  <TabsList>
                    {formSteps.map((step) => (
                      <TabsTrigger key={step.id} value={step.id}>
                        {step.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="location">
                    <LocationStep form={form} useGoogleMaps={useGoogleMaps} />
                  </TabsContent>
                  <TabsContent value="basic">
                    <BasicInfoStep form={form} />
                  </TabsContent>
                  <TabsContent value="features">
                    <FeaturesStep form={form} />
                  </TabsContent>
                  <TabsContent value="media">
                    <MediaStep
                      form={form}
                      imageUrl={imageUrl}
                      setImageUrl={setImageUrl}
                      additionalImageUrls={additionalImageUrls}
                      setAdditionalImageUrls={setAdditionalImageUrls}
                    />
                  </TabsContent>
                </Tabs>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const currentIndex = formSteps.findIndex(step => step.id === currentStep);
                      if (currentIndex > 0) {
                        setCurrentStep(formSteps[currentIndex - 1].id);
                      }
                    }}
                  >
                    Previous
                  </Button>
                  {currentStep === "media" ? (
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Property"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => {
                        const currentIndex = formSteps.findIndex(step => step.id === currentStep);
                        if (currentIndex < formSteps.length - 1) {
                          setCurrentStep(formSteps[currentIndex + 1].id);
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}