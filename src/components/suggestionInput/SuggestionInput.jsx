import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../context/ThemeContext";
import "./SuggestionInput.css";

/**
 * Text input with a suggestion list we control ourselves.
 *
 * Native <datalist> popups are drawn by Chromium and it anchors them to the
 * wrong place (the page corner) when the field lives inside a modal in an RTL
 * layout, so the suggestions "opened somewhere else". This component renders
 * the list in a portal next to the field using the field's own rect.
 */
const SuggestionInput = ({
  value,
  onChange,
  options = [],
  placeholder,
  required,
  id,
  className = "inventory-form__input",
  maxVisible = 8,
}) => {
  const { theme = "dark" } = useTheme() || {};
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [rect, setRect] = useState(null);

  const normalized = (text) => String(text ?? "").trim().toLowerCase();

  const filtered = useMemo(() => {
    const query = normalized(value);
    const matches = query
      ? options.filter(
          (option) =>
            normalized(option.label).includes(query) ||
            normalized(option.value).includes(query),
        )
      : options;
    return matches.slice(0, maxVisible);
  }, [options, value, maxVisible]);

  const syncPosition = () => {
    const el = inputRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    setRect({ top: box.bottom + 4, left: box.left, width: box.width });
  };

  useLayoutEffect(() => {
    if (open) syncPosition();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (
        inputRef.current?.contains(event.target) ||
        listRef.current?.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleScroll = (event) => {
      if (listRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", handleScroll);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const commit = (option) => {
    onChange?.(option.value);
    setOpen(false);
    setHighlight(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!open) {
        setOpen(true);
        return;
      }
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setHighlight((prev) => {
        if (!filtered.length) return -1;
        const next = prev + step;
        if (next < 0) return filtered.length - 1;
        if (next >= filtered.length) return 0;
        return next;
      });
      return;
    }

    if (event.key === "Enter" && open && highlight >= 0) {
      event.preventDefault();
      commit(filtered[highlight]);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  };

  return (
    <div className="suggestion-input">
      <input
        ref={inputRef}
        id={id}
        className={className}
        value={value}
        onChange={(event) => {
          onChange?.(event.target.value);
          setHighlight(-1);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
      />

      {open &&
        rect &&
        filtered.length > 0 &&
        createPortal(
          <ul
            ref={listRef}
            className={`suggestion-input__list suggestion-input__list--${theme}`}
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
            }}
            role="listbox"
          >
            {filtered.map((option, index) => (
              <li key={`${option.value}-${index}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === highlight}
                  className={`suggestion-input__option suggestion-input__option--${theme} ${
                    index === highlight ? "suggestion-input__option--active" : ""
                  }`}
                  onMouseEnter={() => setHighlight(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => commit(option)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
};

export default SuggestionInput;
