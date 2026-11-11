import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Send, X, RotateCcw, ListChecks } from "lucide-react";
import { answerQuestion, getQuickQuestions, getUiStrings } from "../../utils/helpAssistant.js";
import "./HelpAssistant.css";

const Mascot = ({ speaking = false }) => (
  <span className={`help-bot ${speaking ? "help-bot--speaking" : ""}`} aria-hidden="true">
    <svg viewBox="0 0 64 64" className="help-bot__svg" role="presentation">
      <defs>
        <linearGradient id="helpBotFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <line x1="32" y1="10" x2="32" y2="17" stroke="#2dd4bf" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="32" cy="8" r="4" fill="#5eead4" className="help-bot__antenna" />
      <rect x="8" y="16" width="48" height="38" rx="14" fill="url(#helpBotFace)" />
      <rect x="8" y="16" width="48" height="38" rx="14" fill="none" stroke="#5eead4" strokeOpacity="0.45" strokeWidth="1.5" />
      <g className="help-bot__eyes">
        <ellipse cx="24" cy="33" rx="4.2" ry="5.2" fill="#052e2b" />
        <ellipse cx="42" cy="33" rx="4.2" ry="5.2" fill="#052e2b" />
        <circle cx="25.6" cy="31" r="1.5" fill="#ccfbf1" />
        <circle cx="43.6" cy="31" r="1.5" fill="#ccfbf1" />
      </g>
      <path
        d="M25 43c2.4 3 4.8 4.4 8 4.4S39.4 46 42 43"
        fill="none"
        stroke="#052e2b"
        strokeWidth="3"
        strokeLinecap="round"
        className="help-bot__mouth"
      />
      <circle cx="17" cy="41" r="2.4" fill="#0f766e" opacity="0.65" />
      <circle cx="49" cy="41" r="2.4" fill="#0f766e" opacity="0.65" />
    </svg>
  </span>
);

const HelpAssistant = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const uiLanguage = i18n.language || "fa";
  const ui = useMemo(() => getUiStrings(uiLanguage), [uiLanguage]);
  const quickQuestions = useMemo(() => getQuickQuestions(uiLanguage), [uiLanguage]);
  const isRtl = uiLanguage === "ar" || uiLanguage === "fa";

  const [messages, setMessages] = useState([]);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setMessages((current) =>
      current.length > 0 ? current : [{ id: "greeting", role: "bot", text: ui.greeting }],
    );
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(focusTimer);
  }, [isOpen, ui.greeting]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const ask = (text) => {
    const question = String(text || "").trim();
    if (!question || thinking) return;

    setMessages((current) => [
      ...current,
      { id: `q-${Date.now()}`, role: "user", text: question },
    ]);
    setDraft("");
    setThinking(true);

    timerRef.current = setTimeout(() => {
      const reply = answerQuestion(question, uiLanguage);
      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: "bot",
          text: reply.answer,
          title: reply.matched ? reply.title : null,
          label: reply.matched ? reply.label : null,
          matched: reply.matched,
        },
      ]);
      setThinking(false);
    }, 420);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    ask(draft);
  };

  const startNewChat = () => {
    clearTimeout(timerRef.current);
    setThinking(false);
    setDraft("");
    setMessages([{ id: "greeting", role: "bot", text: ui.greeting }]);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  const showSuggestions = messages.filter((m) => m.role === "user").length === 0;

  return (
    <div
      className="help-assistant"
      dir={isRtl ? "rtl" : "ltr"}
      role="dialog"
      aria-label={ui.title}
    >
      <header className="help-assistant__header">
        <Mascot speaking={thinking} />
        <div className="help-assistant__titles">
          <strong>{ui.title}</strong>
          <span>{ui.subtitle}</span>
        </div>
        <div className="help-assistant__tools">
          <button
            type="button"
            className={`help-assistant__tool ${showQuickQuestions ? "help-assistant__tool--active" : ""}`}
            onClick={() => setShowQuickQuestions((shown) => !shown)}
            title={ui.quickQuestions}
            aria-label={ui.quickQuestions}
            aria-pressed={showQuickQuestions}
          >
            <ListChecks size={16} />
          </button>
          <button
            type="button"
            className="help-assistant__tool"
            onClick={startNewChat}
            title={ui.clear}
            aria-label={ui.clear}
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            className="help-assistant__tool"
            onClick={onClose}
            title={ui.close}
            aria-label={ui.close}
          >
            <X size={18} />
          </button>
        </div>
      </header>

      <div className="help-assistant__body" ref={bodyRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`help-msg help-msg--${message.role} ${
              message.matched === false ? "help-msg--fallback" : ""
            }`}
          >
            {message.title && (
              <span className="help-msg__label">
                {message.label}: <b>{message.title}</b>
              </span>
            )}
            <p className="help-msg__text">{message.text}</p>
          </div>
        ))}

        {thinking && (
          <div className="help-msg help-msg--bot help-msg--typing" aria-live="polite">
            <span className="help-typing">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}

        {(showSuggestions || showQuickQuestions) && (
          <div className="help-assistant__suggestions">
            {showQuickQuestions && (
              <span className="help-assistant__suggestions-title">
                {ui.quickQuestions}
              </span>
            )}
            {(showQuickQuestions ? quickQuestions : ui.suggestions).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="help-chip"
                onClick={() => ask(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <form className="help-assistant__form" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className="help-assistant__input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={ui.placeholder}
          aria-label={ui.placeholder}
          dir="auto"
        />
        <button
          type="submit"
          className="help-assistant__send"
          disabled={!draft.trim() || thinking}
          aria-label={ui.send}
          title={ui.send}
        >
          <Send size={18} className="rtl-flip" />
        </button>
      </form>

      <span className="help-assistant__footnote">{t("app_title") || "KuwaitQumash"}</span>
    </div>
  );
};

export default HelpAssistant;
