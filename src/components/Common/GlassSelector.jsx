import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export default function GlassSelect({
  label,
  value,
  onChange,
  options,
  accent = "emerald",
}) {
  const selectedOption = options.find((o) => o.value === value) || options[0];

  const accentColors = {
    emerald: "text-emerald-600 dark:text-emerald-400 font-semibold",
    rose: "text-rose-600 dark:text-rose-400 font-semibold",
  };

  const activeAccent = accentColors[accent] || accentColors.emerald;

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full flex items-center justify-between rounded-xl px-3 h-9 bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition cursor-pointer">
            <span className="truncate">
              {selectedOption?.label || "Select category"}
            </span>
            <FiChevronDown className="text-neutral-400 dark:text-neutral-500 text-sm shrink-0 ml-2" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1.5 max-h-56 w-full overflow-auto rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 text-xs shadow-xl focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active, selected }) =>
                    `relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer select-none transition-colors ${
                      active
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
                        : "text-neutral-700 dark:text-neutral-300"
                    } ${selected ? activeAccent : ""}`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className="truncate">{option.label}</span>
                      {selected && (
                        <FiCheck className="text-xs shrink-0 ml-2" />
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
