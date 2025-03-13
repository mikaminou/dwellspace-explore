
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  disabled?: boolean;
  dir?: "ltr" | "rtl";  // Add the dir property to the interface
}

export function PasswordField({
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  disabled = false,
  dir = "ltr"  // Set a default value
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
        className={`pr-10 ${dir === 'rtl' ? 'text-right' : ''}`}
        dir={dir}
      />
      <button 
        type="button" 
        className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none`}
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
