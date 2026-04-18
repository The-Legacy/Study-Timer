import { useState } from 'react'
import ScheduleBuilder from './components/ScheduleBuilder'
import TimerView from './components/TimerView'
import TitleBar from './components/TitleBar'
import { Block } from './types'

type AppView = 'builder' | 'timer'

export default function App(): JSX.Element {
  const [view, setView] = useState<AppView>('builder')
  const [blocks, setBlocks] = useState<Block[]>([])

  return (
    <div className="app-root">
      <TitleBar />
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
