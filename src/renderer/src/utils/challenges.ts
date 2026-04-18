export type ChallengeTag = 'brain' | 'physical' | 'creative'

export interface Challenge {
  title: string
  description: string
  url?: string
  tag: ChallengeTag
}

const WIKI_PAIRS = [
  ['Cleopatra', 'Refrigerator'],
  ['The Moon', 'Jazz music'],
  ['Napoleon', 'Basketball'],
  ['Volcanoes', 'Chess'],
  ['Ancient Rome', 'Hot dogs'],
  ['Nikola Tesla', 'Tacos'],
  ['The Amazon', 'Ice cream'],
  ['Genghis Khan', 'Bubble wrap'],
  ['Greta Thunberg', 'Elon Musk'],
]

function randomPair(): [string, string] {
  return WIKI_PAIRS[Math.floor(Math.random() * WIKI_PAIRS.length)] as [string, string]
}

const PHYSICAL: Challenge[] = [
  { title: 'Pushup set', description: 'Do 15 pushups. Take a break halfway if needed.', tag: 'physical' },
  { title: 'Stretch break', description: 'Touch your toes, roll your neck, stretch your wrists. 90 seconds.', tag: 'physical' },
  { title: 'Plank', description: 'Hold a plank for 45 seconds. Keep your core tight.', tag: 'physical' },
]

const WEB: Challenge[] = [
  { title: 'Wordle', description: 'Guess today\'s 5-letter word in 6 tries.', url: 'https://www.nytimes.com/games/wordle/index.html', tag: 'brain' },
  { title: 'Mini Crossword', description: 'Knock out the NYT Mini in under 2 minutes.', url: 'https://www.nytimes.com/crosswords/game/mini', tag: 'brain' },
  { title: 'Connections', description: 'Group the 16 words into 4 categories.', url: 'https://www.nytimes.com/games/connections', tag: 'brain' },
  { title: 'Typeracer', description: 'Type a passage as fast as you can. Beat your last score.', url: 'https://play.typeracer.com', tag: 'brain' },
  { title: 'Chess puzzle', description: 'Solve today\'s daily chess puzzle.', url: 'https://www.chess.com/daily-chess-puzzle', tag: 'brain' },
  { title: 'Sporcle quiz', description: 'Pick a random quiz and ace it.', url: 'https://www.sporcle.com/games/random', tag: 'brain' },
  { title: 'GeoGuessr', description: 'One round of GeoGuessr. Where in the world are you?', url: 'https://www.geoguessr.com', tag: 'brain' },
]

function makeWikiRace(): Challenge {
  const [from, to] = randomPair()
  return {
    title: 'Wikipedia Race',
    description: `Navigate from "${from}" to "${to}" using only Wikipedia links. No search bar.`,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(from.replace(/ /g, '_'))}`,
    tag: 'brain',
  }
}

export function randomChallenge(): Challenge {
  const all = [...PHYSICAL, ...WEB]
  // occasionally swap in a wiki race
  if (Math.random() < 0.3) return makeWikiRace()
  return all[Math.floor(Math.random() * all.length)]
}
