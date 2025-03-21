
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
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Define the schema type
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["buyer", "seller", "agent", "admin"]),
  agency: z.string().optional(),
  license_number: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  loading: boolean;
}

export function ProfileForm({ form, onSubmit, loading }: ProfileFormProps) {
  const watchRole = form.watch("role");
  const isOwner = watchRole === "agent" || watchRole === "seller";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Edit Profile
        </CardTitle>
        <CardDescription>
          Update your profile information
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
                    <FormLabel>
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                  <FormLabel>
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>
                    I am a
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isOwner && (
              <>
                <FormField
                  control={form.control}
                  name="agency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {watchRole === "agent" ? "Agency Name" : "Business Name"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchRole === "agent" && (
                  <FormField
                    control={form.control}
                    name="license_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          License Number
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    About Me
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4}
                      placeholder="Tell us a little about yourself"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
