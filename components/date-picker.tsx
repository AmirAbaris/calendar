import dayjs from "dayjs";
import jalaliday from "jalaliday";
import { useState } from "react";

dayjs.extend(jalaliday);

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedDate: string | null; // Format: "YYYY/MM/DD"
  onSelectDate: (date: string) => void; // Format: "YYYY/MM/DD"
  minDate?: string; // Format: "YYYY/MM/DD"
  maxDate?: string; // Format: "YYYY/MM/DD"
};

export default function DatePicker(props: Props) {
  const { visible, onClose, selectedDate, onSelectDate, minDate, maxDate } =
    props;
  // first i'll code dirty here, then i'll improve codebase
  // in this project my main focus is to code with less ai tools to keep my skills intact -- it was boring tbh a little bit

  const WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const MONTHS = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  // utils
  const getToday = () => {
    const today = dayjs().calendar("jalali");

    return {
      year: today.year(),
      month: today.month() + 1,
      day: today.date(),
    };
  };

  const parseDate = (dateStr: string | null) => {
    if (!dateStr) {
      return getToday();
    }

    const [year, month, day] = dateStr.split("/").map(Number);

    if (!year || !month || !day) return getToday();

    return { year, month, day };
  };

  const initalDate = parseDate(selectedDate);
  const [currentYear, setCurrentYear] = useState(initalDate.year);
  const [currentMonth, setCurrentMonth] = useState(initalDate.month);
  const [currentDay, setCurrentDay] = useState(initalDate.day);

  const getMinMaxDates = () => {
    const today = getToday();
    const min = minDate ? parseDate(minDate) : today;
    const max = maxDate
      ? parseDate(maxDate)
      : {
          year: today.year + 1,
          month: today.month,
          day: today.day,
        };

    return { min, max };
  };

  const getDaysInMonth = (year: number, month: number) => {
    const jalaliDate = dayjs()
      .calendar("jalali")
      .year(year)
      .month(month - 1)
      .date(1);

    return jalaliDate.daysInMonth();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const jalaliDate = dayjs()
      .calendar("jalali")
      .year(year)
      .month(month - 1)
      .date(1);

    const day = jalaliDate.day();
    console.log(day);
    return day === 6 ? 0 : day + 1;
  };

  const isDateDisabled = (day: number) => {
    const { min, max } = getMinMaxDates();

    if (currentYear < min.year || currentYear > max.year) return true;
    if (currentYear === min.year && currentMonth < min.month) return true;
    if (currentYear === min.year && currentMonth === min.month && day < min.day)
      return true;
    if (currentYear === max.year && currentMonth > max.month) return true;
    if (currentYear === max.year && currentMonth === max.month && day > max.day)
      return true;

    return false;
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return;

    const dateStr = `${currentYear}/${String(currentMonth).padStart(
      2,
      "0"
    )}/${String(day).padStart(2, "0")}`;

    setCurrentDay(day);
    onSelectDate(dateStr);
  };

  const today = getToday();
  const selectedDateParsed = parseDate(selectedDate);
  const selectedDay =
    selectedDateParsed.year === currentYear &&
    selectedDateParsed.month === currentMonth
      ? selectedDateParsed.day
      : null;

  return (
    <>
      {/* header */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <button onClick={handlePrevMonth}>
          <p>قبلی</p>
        </button>
        <button onClick={handleNextMonth}>
          <p>بعدی</p>
        </button>
      </div>
      {/* month */}
      <div className="text-center text-2xl font-bold mb-4">
        {MONTHS[currentMonth - 1]} {currentYear}
      </div>
      {/* weeks */}
      <div className="grid grid-cols-7 gap-12 mb-4">
        {WEEKDAYS.map((day: string) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* calendar grid - empty days + actual days in ONE grid */}
      <div className="grid grid-cols-7 gap-4">
        {/* empty days - fills cells before first day of month */}
        {Array.from({
          length: getFirstDayOfMonth(currentYear, currentMonth),
        }).map((_, index) => (
          <div key={`empty-${index}`}></div>
        ))}

        {/* actual days of the month */}
        {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }).map(
          (_, index) => {
            const day = index + 1;

            const isDisabled = isDateDisabled(day);

            const isSelected = selectedDay === day;

            const isToday =
              currentYear === today.year &&
              currentMonth === today.month &&
              day === today.day;

            return (
              <div
                key={day}
                className="aspect-square flex items-center justify-center"
              >
                <button
                  onClick={() => handleDateClick(day)}
                  disabled={isDisabled}
                  className={`w-full h-full flex items-center justify-center rounded-full p-3 ${
                    isSelected
                      ? "bg-orange-600 text-black font-medium"
                      : isToday
                      ? "text-orange-600 font-bold"
                      : isDisabled
                      ? "text-gray-400"
                      : "text-gray-900"
                  }`}
                >
                  {day}
                </button>
              </div>
            );
          }
        )}
      </div>
    </>
  );
}
