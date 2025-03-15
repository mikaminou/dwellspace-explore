
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/language/LanguageContext";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["buyer", "seller", "agent", "admin"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { session, isLoaded } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, dir, translateUserInput } = useLanguage();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      bio: "",
      role: "buyer",
    },
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (!session) {
      navigate("/signin");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (data) {
          form.reset({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone_number: data.phone_number || "",
            bio: data.bio || "",
            role: data.role,
          });
          setProfileData(data as ProfileFormValues);
        }
      } catch (error: any) {
        toast({
          title: t('profile.errorLoading') || "Error loading profile",
          description: error.message || t('profile.errorLoadingDescription') || "Could not load your profile information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, isLoaded, navigate, toast, form, t]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          bio: values.bio,
          role: values.role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session?.user.id);

      if (error) throw error;

      toast({
        title: t('profile.updated') || "Profile updated",
        description: t('profile.updatedDescription') || "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: t('profile.errorUpdating') || "Error updating profile",
        description: error.message || t('profile.errorUpdatingDescription') || "Could not update your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">{t('profile.loading') || "Loading..."}</div>;
  }

  const userEmail = session?.user?.email;
  const userAvatar = session?.user?.user_metadata?.avatar_url;
  const userName = profileData?.first_name || session?.user?.user_metadata?.first_name || "";
  const userInitials = userName 
    ? userName.slice(0, 2).toUpperCase() 
    : userEmail 
      ? userEmail.slice(0, 2).toUpperCase() 
      : "U";

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <div className={`flex flex-col md:flex-row gap-8 ${dir === 'rtl' ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle className={dir === 'rtl' ? 'text-right arabic-text' : ''}>
                    {t('profile.title') || "Profile"}
                  </CardTitle>
                  <CardDescription className={dir === 'rtl' ? 'text-right arabic-text' : ''}>
                    {t('profile.subtitle') || "Your personal information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={userAvatar || undefined} alt={userName} />
                    <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-medium">
                    {profileData?.first_name || ""} {profileData?.last_name || ""}
                  </h3>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                  <p className="text-sm mt-2 capitalize">{profileData?.role || ""}</p>
                </CardContent>
              </Card>
            </div>
            <div className="w-full md:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle className={dir === 'rtl' ? 'text-right arabic-text' : ''}>
                    {t('profile.editTitle') || "Edit Profile"}
                  </CardTitle>
                  <CardDescription className={dir === 'rtl' ? 'text-right arabic-text' : ''}>
                    {t('profile.editSubtitle') || "Update your profile information"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={dir === 'rtl' ? 'text-right block arabic-text' : ''}>
                                {t('profile.firstName') || "First Name"}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className={dir === 'rtl' ? 'text-right' : ''}
                                  dir={dir}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={dir === 'rtl' ? 'text-right block arabic-text' : ''}>
                                {t('profile.lastName') || "Last Name"}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className={dir === 'rtl' ? 'text-right' : ''}
                                  dir={dir}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={dir === 'rtl' ? 'text-right block arabic-text' : ''}>
                              {t('phone.label') || "Phone Number"}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className={dir === 'rtl' ? 'text-right' : ''}
                                dir={dir}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={dir === 'rtl' ? 'text-right block arabic-text' : ''}>
                              {t('role.label') || "I am a"}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={dir === 'rtl' ? 'text-right' : ''}>
                                  <SelectValue placeholder={t('profile.selectRole') || "Select a role"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="buyer">{t('role.buyer') || "Buyer"}</SelectItem>
                                <SelectItem value="seller">{t('role.seller') || "Seller"}</SelectItem>
                                <SelectItem value="agent">{t('role.agent') || "Agent"}</SelectItem>
                                <SelectItem value="admin">{t('profile.admin') || "Admin"}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={dir === 'rtl' ? 'text-right block arabic-text' : ''}>
                              {t('profile.aboutMe') || "About Me"}
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                rows={4}
                                placeholder={t('profile.aboutMePlaceholder') || "Tell us a little about yourself"}
                                {...field} 
                                className={dir === 'rtl' ? 'text-right' : ''}
                                dir={dir}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (t('profile.saving') || "Saving...") : (t('profile.saveChanges') || "Save Changes")}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
