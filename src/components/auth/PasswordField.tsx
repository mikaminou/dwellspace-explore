
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  disabled?: boolean;
}

export function PasswordField({
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  disabled = false
}: PasswordFieldProps) {
  return (
    <div className="relative">
      <Input 
        id="password" 
        type={showPassword ? "text" : "password"} 
        placeholder="••••••••" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={disabled}
        className="pr-10"
      />
      <button 
        type="button" 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
        onClick={togglePasswordVisibility}
        disabled={disabled}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
