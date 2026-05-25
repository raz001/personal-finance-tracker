import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const iconBtn = "flex items-center justify-center w-9 h-9 min-w-[36px] rounded-md bg-transparent text-text-muted hover:bg-surface-2 hover:text-text-base transition-colors duration-[160ms] p-[0.4rem]";

const MonthFilter = ({ month, year, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  const step = (direction) => {
    let m = month + direction;
    let y = year;
    if (m < 1)  { m = 12; y -= 1; }
    if (m > 12) { m = 1;  y += 1; }
    onChange({ month: m, year: y });
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" className={iconBtn} onClick={() => step(-1)} aria-label="Previous month">
        <ChevronLeft size={16} />
      </button>

      <div className="flex flex-wrap gap-3">
        <label className="text-text-muted text-[0.8rem] font-semibold min-w-[120px]">
          Month
          <select
            value={month}
            onChange={(e) => onChange({ month: Number(e.target.value), year })}
            className="text-[0.875rem] py-[0.45rem] px-[0.7rem]"
          >
            {MONTHS.map((name, i) => (
              <option key={name} value={i + 1}>{name}</option>
            ))}
          </select>
        </label>

        <label className="text-text-muted text-[0.8rem] font-semibold min-w-[120px]">
          Year
          <select
            value={year}
            onChange={(e) => onChange({ month, year: Number(e.target.value) })}
            className="text-[0.875rem] py-[0.45rem] px-[0.7rem]"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>

      <button type="button" className={iconBtn} onClick={() => step(1)} aria-label="Next month">
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default MonthFilter;
