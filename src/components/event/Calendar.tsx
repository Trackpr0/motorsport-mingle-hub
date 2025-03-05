
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarDay {
  day: number;
  month: number;
  year: number;
  current: boolean;
}

interface CalendarProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  startDate: Date | null;
  endDate: Date | null;
  isMultiDay: boolean;
  onDateSelection: (day: CalendarDay) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  setCurrentMonth,
  startDate,
  endDate,
  isMultiDay,
  onDateSelection,
}) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  
  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    
    const prevMonthDays = [];
    const currentMonthDays = [];
    const nextMonthDays = [];
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthTotalDays = daysInMonth(prevMonthYear, prevMonth);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      prevMonthDays.push({
        day: prevMonthTotalDays - i,
        month: prevMonth,
        year: prevMonthYear,
        current: false
      });
    }
    
    for (let i = 1; i <= days; i++) {
      currentMonthDays.push({
        day: i,
        month,
        year,
        current: true
      });
    }
    
    const totalCalendarDays = 42;
    const remainingDays = totalCalendarDays - (prevMonthDays.length + currentMonthDays.length);
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        current: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };
  
  const handleMonthChange = (value: string) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(parseInt(value));
      return newMonth;
    });
  };
  
  const handleYearChange = (value: string) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(parseInt(value));
      return newMonth;
    });
  };
  
  const isDateInRange = (day: CalendarDay) => {
    if (!day.current) return false;
    if (!startDate) return false;
    
    const date = new Date(day.year, day.month, day.day);
    
    if (!isMultiDay || !endDate) {
      // Single day selection
      return (
        startDate.getDate() === day.day &&
        startDate.getMonth() === day.month &&
        startDate.getFullYear() === day.year
      );
    } else {
      // Multi-day selection - check if date is within range (inclusive)
      return date >= startDate && date <= endDate;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePrevMonth} 
          className="text-blue-600"
        >
          &lt;
        </button>
        
        <div className="flex items-center justify-center gap-2">
          <Select
            value={currentMonth.getMonth().toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="h-auto py-0 px-1 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 shadow-none font-medium text-blue-600 [&>svg]:hidden">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={currentMonth.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-auto py-0 px-1 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 shadow-none font-medium text-blue-600 [&>svg]:hidden">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <button 
          onClick={handleNextMonth}
          className="text-blue-600"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-center">
        <div className="text-blue-600 font-medium">M</div>
        <div className="text-blue-600 font-medium">T</div>
        <div className="text-blue-600 font-medium">W</div>
        <div className="text-blue-600 font-medium">T</div>
        <div className="text-blue-600 font-medium">F</div>
        <div className="text-blue-600 font-medium">S</div>
        <div className="text-blue-600 font-medium">S</div>
        
        {getCalendarDays().map((day, index) => (
          <div 
            key={index}
            onClick={() => onDateSelection(day)}
            className={`p-2 cursor-pointer ${
              day.current ? "text-black" : "text-gray-400"
            } ${
              isDateInRange(day) ? "bg-blue-600 text-white rounded-full" : ""
            }`}
          >
            {day.day}
          </div>
        ))}
      </div>
      
      {isMultiDay && (
        <div className="mt-4 text-sm">
          {startDate && endDate ? (
            <p className="text-blue-600">
              Selected: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </p>
          ) : startDate ? (
            <p className="text-blue-600">
              Start date: {startDate.toLocaleDateString()} - Please select end date
            </p>
          ) : (
            <p className="text-blue-600">Please select start date</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
