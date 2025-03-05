
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
    if (!startDate) return false;
    if (!isMultiDay || !endDate) return false;
    
    const date = new Date(day.year, day.month, day.day);
    return date > startDate && date < endDate;
  };

  const isStartDate = (day: CalendarDay) => {
    if (!startDate) return false;
    return (
      startDate.getDate() === day.day &&
      startDate.getMonth() === day.month &&
      startDate.getFullYear() === day.year
    );
  };

  const isEndDate = (day: CalendarDay) => {
    if (!endDate) return false;
    return (
      endDate.getDate() === day.day &&
      endDate.getMonth() === day.month &&
      endDate.getFullYear() === day.year
    );
  };

  const isSelectedDate = (day: CalendarDay) => {
    if (!startDate) return false;
    
    // For single day selection
    if (!isMultiDay || !endDate) {
      return isStartDate(day);
    }
    
    // For multi-day selection, check if it's either the start or end date
    return isStartDate(day) || isEndDate(day);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePrevMonth} 
          className="text-blue-600 p-2"
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
          className="text-blue-600 p-2"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-center">
        <div className="text-blue-600 font-medium">S</div>
        <div className="text-blue-600 font-medium">M</div>
        <div className="text-blue-600 font-medium">T</div>
        <div className="text-blue-600 font-medium">W</div>
        <div className="text-blue-600 font-medium">T</div>
        <div className="text-blue-600 font-medium">F</div>
        <div className="text-blue-600 font-medium">S</div>
        
        {getCalendarDays().map((day, index) => {
          const inRange = isDateInRange(day);
          const isStart = isStartDate(day);
          const isEnd = isEndDate(day);
          
          let className = "h-10 w-10 flex items-center justify-center cursor-pointer rounded-md ";
          
          // Apply text color based on whether it's current month or not
          className += day.current ? "text-black" : "text-gray-400";
          
          // Apply styling for dates in range
          if (inRange && isMultiDay) {
            className = className.replace("rounded-md", "");
            className += " bg-blue-100";
          }
          
          // Apply special styling for start date
          if (isStart) {
            className = `h-10 w-10 flex items-center justify-center cursor-pointer text-white ${day.current ? "bg-blue-800" : "bg-blue-800 opacity-50"}`;
            
            // If there's an end date and it's not the same as start date, style the left side
            if (endDate && startDate?.getTime() !== endDate?.getTime()) {
              className += " rounded-l-md";
            } else {
              className += " rounded-md";
            }
          }
          
          // Apply special styling for end date
          if (isEnd && startDate?.getTime() !== endDate?.getTime()) {
            className = `h-10 w-10 flex items-center justify-center cursor-pointer text-white ${day.current ? "bg-blue-800" : "bg-blue-800 opacity-50"}`;
            className += " rounded-r-md";
          }
          
          // If it's a single day selection (or start and end are the same)
          if (isStart && (!isMultiDay || (isEnd && startDate?.getTime() === endDate?.getTime()))) {
            className = `h-10 w-10 flex items-center justify-center cursor-pointer text-white rounded-md ${day.current ? "bg-blue-800" : "bg-blue-800 opacity-50"}`;
          }
          
          return (
            <div 
              key={index}
              onClick={() => onDateSelection(day)}
              className={className}
            >
              {day.day}
            </div>
          );
        })}
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
      {!isMultiDay && startDate && (
        <div className="mt-4 text-sm">
          <p className="text-blue-600">
            Selected: {startDate.toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Calendar;
