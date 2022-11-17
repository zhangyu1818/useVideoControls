import React from 'react'

export const videoControlsContext = React.createContext<
  React.MutableRefObject<HTMLVideoElement | null>
>({ current: null })

const { Provider } = videoControlsContext

interface VideoControlsProviderProps {
  children?: React.ReactNode
}

export const VideoControlsProvider: React.FC<
  VideoControlsProviderProps
> = props => {
  const { children } = props
  const videoControlsRef = React.useRef<HTMLVideoElement>(null)
  return <Provider value={videoControlsRef}>{children}</Provider>
}
