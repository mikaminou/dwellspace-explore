
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      setLoading(true);
      await signIn(email, password);
      navigate("/");
    } catch (error: any) {
      setError(error.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto flex justify-center items-center py-16">
        <Card className="w-full max-w-md glass fade-in">
          <CardHeader>
            <CardTitle className={`text-2xl font-bold text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
              {t('signin.title')}
            </CardTitle>
            <CardDescription className={`text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
              {t('signin.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={dir === 'rtl' ? 'block text-right arabic-text' : ''}>
                  {t('signin.email')}
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={dir === 'rtl' ? 'text-right' : ''}
                  dir={dir}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className={dir === 'rtl' ? 'block text-right arabic-text' : ''}>
                  {t('signin.password')}
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={dir === 'rtl' ? 'text-right' : ''}
                  dir={dir}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-primary" disabled={loading}>
                {loading ? (dir === 'rtl' ? "جاري تسجيل الدخول..." : "Connexion en cours...") : t('signin.button')}
              </Button>
            </form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className={`text-sm text-muted-foreground ${dir === 'rtl' ? 'arabic-text' : ''}`}>
              {t('signin.noAccount')}{" "}
              <Link to="/signup" className="text-primary hover:underline">
                {t('signin.create')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
