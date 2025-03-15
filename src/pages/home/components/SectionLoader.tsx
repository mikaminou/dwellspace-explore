
import React from "react";

export const SectionLoader: React.FC = () => (
  <div className="py-16">
    <div className="container mx-auto px-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted/50 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg bg-muted/30 h-64"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
