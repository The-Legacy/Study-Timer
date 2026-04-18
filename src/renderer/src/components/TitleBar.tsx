import { Theme } from '../App'

interface Props {
  theme: Theme
  onToggleTheme: () => void
}

export default function TitleBar({ theme, onToggleTheme }: Props): JSX.Element {
  return (
    <div className="titlebar">
      <div className="titlebar-drag">Study Timer</div>
      <div className="titlebar-controls">
        <button className="tb-btn tb-theme" onClick={onToggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        <div className="tb-separator" />
        <button className="tb-btn tb-minimize" onClick={() => window.windowControls.minimize()} title="Minimize">
          <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1.5" rx="0.75" fill="currentColor"/></svg>
        </button>
        <button className="tb-btn tb-maximize" onClick={() => window.windowControls.maximize()} title="Maximize">
          <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0.75" y="0.75" width="8.5" height="8.5" rx="1.25" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
        </button>
        <button className="tb-btn tb-close" onClick={() => window.windowControls.close()} title="Close">
          <svg width="10" height="10" viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  )
}
