
import { MainNav } from "@/components/MainNav";
import { PropertyForm } from "@/components/owners/PropertyForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function PropertyCreate() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <MainNav />
        <PropertyForm />
      </div>
    </ProtectedRoute>
  );
}
