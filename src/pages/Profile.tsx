
import { MainNav } from "@/components/MainNav";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/language/LanguageContext";

export default function ProfilePage() {
  const { form, loading, onSubmit, userInfo, isLoaded } = useProfile();
  const { dir, t } = useLanguage();

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">{t('profile.loading') || "Loading..."}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <div className={`flex flex-col md:flex-row gap-8 ${dir === 'rtl' ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-full md:w-1/3">
              <ProfileSidebar 
                userAvatar={userInfo.userAvatar}
                userName={`${userInfo.userName} ${form.getValues().last_name || ""}`}
                userEmail={userInfo.userEmail}
                userRole={userInfo.userRole}
                userInitials={userInfo.userInitials}
              />
            </div>
            <div className="w-full md:w-2/3">
              <ProfileForm 
                form={form}
                onSubmit={onSubmit}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
