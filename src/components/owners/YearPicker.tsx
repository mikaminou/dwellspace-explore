
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface YearPickerProps {
  value?: number;
  onChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
}

export function YearPicker({
  value,
  onChange,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
  className,
}: YearPickerProps) {
  const [yearPage, setYearPage] = React.useState(() => {
    if (value) return Math.floor(value / 20) * 20;
    return Math.floor(new Date().getFullYear() / 20) * 20;
  });

  const years = React.useMemo(() => {
    const yearsArray = [];
    for (let i = 0; i < 20; i++) {
      yearsArray.push(yearPage + i);
    }
    return yearsArray;
  }, [yearPage]);

  const handlePreviousPage = () => {
    setYearPage(yearPage - 20);
  };

  const handleNextPage = () => {
    setYearPage(yearPage + 20);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value ? value : <span>Select year</span>}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2 flex justify-between items-center border-b">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handlePreviousPage}
            disabled={yearPage <= minYear}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {yearPage} - {yearPage + 19}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleNextPage}
            disabled={yearPage + 20 > maxYear}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 p-2 gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={year === value ? "default" : "outline"}
              className={cn(
                "h-9 w-14",
                year === value && "bg-primary text-primary-foreground",
                year < minYear || year > maxYear && "opacity-50 cursor-not-allowed"
              )}
              disabled={year < minYear || year > maxYear}
              onClick={() => {
                onChange(year);
              }}
            >
              {year}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
