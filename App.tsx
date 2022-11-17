import React from 'react'
import ReactDOM from 'react-dom/client'

import { useVideoControls } from './src'

const App = () => {
  const [videoControls, ref] = useVideoControls()

  return (
    <div>
      <video
        controls
        ref={ref}
        src='https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm'
      />
      <div>
        <p>
          {videoControls.currentTime}/{videoControls.duration}
        </p>
        <p>
          status: {videoControls.status}, paused: {videoControls.paused + ''}
        </p>
        <p>play status: {videoControls.playStatus}</p>
        <nav>
          <button onClick={videoControls.play}>play</button>
          <button onClick={videoControls.pause}>pause</button>
          <label>
            <input
              type='checkbox'
              checked={videoControls.muted}
              onChange={({ target }) => (videoControls.muted = target.checked)}
            />
            muted
          </label>
          <label>
            <input
              type='checkbox'
              checked={videoControls.loop}
              onChange={({ target }) => (videoControls.loop = target.checked)}
            />
            loop
          </label>
        </nav>
        <nav>
          <label>
            progress:
            <input
              type='range'
              min={0}
              max={videoControls.duration}
              step={0.001}
              value={videoControls.currentTime}
              onChange={({ target }) =>
                (videoControls.currentTime = +target.value)
              }
            />
            ({videoControls.currentTime})
          </label>
          <label>
            volume:
            <input
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={videoControls.muted ? 0 : videoControls.volume}
              onChange={({ target }) => (videoControls.volume = +target.value)}
            />
            ({videoControls.muted ? 0 : videoControls.volume})
          </label>
          <label>
            rate:
            <input
              type='range'
              min={0.25}
              max={2}
              step={0.25}
              value={videoControls.playbackRate}
              onChange={({ target }) =>
                (videoControls.playbackRate = +target.value)
              }
            />
            ({videoControls.playbackRate})
          </label>
        </nav>
        <nav>
          <button onClick={videoControls.requestPictureInPicture}>
            picture in picture
          </button>
          <button onClick={() => videoControls.exitPictureInPicture()}>
            exit picture in picture
          </button>
        </nav>
      </div>
      <Nested />
    </div>
  )
}

const Nested = () => {
  const [videoControls] = useVideoControls()

  return (
    <>
      <p>child component</p>
      <button onClick={videoControls.requestFullScreen}>full screen</button>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
