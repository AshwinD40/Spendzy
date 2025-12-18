import { Listbox } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

function GlassSelect({ label, value, onChange, options, accent = "emerald" }) {
  const selectedLabel =
    options.find(o => o.value === value)?.label || "Select category";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-200">{label}</label>

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={`
              w-full flex items-center justify-between
              rounded-xl px-4 py-3
              bg-white/10 backdrop-blur-xl
              border border-white/20
              text-white
              transition-all duration-200
              focus:outline-none
              focus:ring-2 focus:ring-${accent}-400/40
            `}
          >
            <span className={value ? "text-white" : "text-gray-400"}>
              {selectedLabel}
            </span>
            <FiChevronDown className="text-gray-300 text-lg" />
          </Listbox.Button>

          <Listbox.Options
            className="
              absolute z-50 mt-2 w-full
              rounded-xl
              bg-zinc-900/95 backdrop-blur-xl
              border border-white/15
              shadow-2xl
              overflow-hidden
            "
          >
            {options.map(option => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `
                    cursor-pointer px-4 py-3 text-sm
                    transition-colors
                    ${active ? "bg-white/10 text-white" : "text-gray-300"}
                  `
                }
              >
                {({ selected }) => (
                  <span
                    className={
                      selected
                        ? `font-semibold text-${accent}-300`
                        : ""
                    }
                  >
                    {option.label}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}

export default GlassSelect;
