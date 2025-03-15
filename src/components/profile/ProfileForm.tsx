
import { Button } from "@/components/ui/button";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Define the schema type
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["buyer", "seller", "agent", "admin"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  loading: boolean;
}

export function ProfileForm({ form, onSubmit, loading }: ProfileFormProps) {
  const { t, dir } = useLanguage();

  return (
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
  );
}
