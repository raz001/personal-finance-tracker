import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const MonthFilter = ({ month, year, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  const step = (direction) => {
    let m = month + direction;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    onChange({ month: m, year: y });
  };

  return (
    <div className="month-filter">
      <button
        type="button"
        className="icon-button"
        onClick={() => step(-1)}
        aria-label="Previous month"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="filter-row">
        <label>
          Month
          <select
            value={month}
            onChange={(e) => onChange({ month: Number(e.target.value), year })}
          >
            {MONTHS.map((name, i) => (
              <option key={name} value={i + 1}>{name}</option>
            ))}
          </select>
        </label>

        <label>
          Year
          <select
            value={year}
            onChange={(e) => onChange({ month, year: Number(e.target.value) })}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        className="icon-button"
        onClick={() => step(1)}
        aria-label="Next month"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default MonthFilter;
