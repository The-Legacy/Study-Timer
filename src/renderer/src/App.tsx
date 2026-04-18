import { useState, useEffect } from 'react'
import ScheduleBuilder from './components/ScheduleBuilder'
import TimerView from './components/TimerView'
import TitleBar from './components/TitleBar'
import { Block } from './types'

export type Theme = 'dark' | 'light'
type AppView = 'builder' | 'timer'

export default function App(): JSX.Element {
  const [view, setView] = useState<AppView>('builder')
  const [blocks, setBlocks] = useState<Block[]>([])
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) ?? 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="app-root">
      <TitleBar theme={theme} onToggleTheme={toggleTheme} />
      <div className="app-content">
        {view === 'builder' ? (
          <ScheduleBuilder
            blocks={blocks}
            onBlocksChange={setBlocks}
            onStart={() => setView('timer')}
          />
        ) : (
          <TimerView blocks={blocks} onFinish={() => setView('builder')} />
        )}
      </div>
    </div>
  )
}
