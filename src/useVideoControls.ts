import React from 'react'
import { videoControlsContext } from './Context'

export type VideoStatus =
  | 'canplay'
  | 'play'
  | 'playing'
  | 'pause'
  | 'waiting'
  | 'seeking'
  | 'seeked'
  | 'ended'

export type PlayStatus = 'playing' | 'paused' | 'waiting'

export interface VideoControls {
  element: HTMLVideoElement | null
  play: () => Promise<void>
  pause: () => void
  currentTime: number
  muted: boolean
  volume: number
  playbackRate: number
  loop: boolean

  get duration(): number
  get paused(): boolean
  get status(): VideoStatus
  get playStatus(): PlayStatus

  requestPictureInPicture(): Promise<PictureInPictureWindow | void>
  exitPictureInPicture(options?: FullscreenOptions): Promise<void>
  requestFullScreen(): Promise<void>
  exitFullscreen(): Promise<void>
}

export interface UseVideoControlsParams {
  defaultMute?: boolean
  defaultVolume?: number
  defaultPlayRate?: number
  defaultLoop?: boolean
}

export const useVideoControls = (params: UseVideoControlsParams = {}) => {
  const {
    defaultMute = false,
    defaultVolume = 1,
    defaultPlayRate = 1,
    defaultLoop = false,
  } = params

  const videoRef = React.useContext(videoControlsContext)

  const forceUpdate = React.useReducer(() => ({}), {})[1]

  const videoStatusRef = React.useRef<VideoStatus>('pause')
  const playStatusRef = React.useRef<PlayStatus>('paused')

  React.useLayoutEffect(() => {
    if (!videoRef.current) {
      console.log('video element is not defined')
      return
    }

    // set default params
    videoRef.current.muted = defaultMute
    videoRef.current.volume = defaultVolume
    videoRef.current.playbackRate = defaultPlayRate
    videoRef.current.loop = defaultLoop

    let waitingStatusTimer = 0

    const removeListeners = [
      addVideoEventListener('canplay', () =>
        forceUpdateRefValue(videoStatusRef, 'canplay')
      ),
      addVideoEventListener('play', () =>
        forceUpdateRefValue(videoStatusRef, 'play')
      ),
      addVideoEventListener('playing', () =>
        forceUpdateRefValue(videoStatusRef, 'playing')
      ),
      addVideoEventListener('pause', () =>
        forceUpdateRefValue(videoStatusRef, 'pause')
      ),
      addVideoEventListener('waiting', () =>
        forceUpdateRefValue(videoStatusRef, 'waiting')
      ),
      addVideoEventListener('seeking', () =>
        forceUpdateRefValue(videoStatusRef, 'seeking')
      ),
      addVideoEventListener('seeked', () =>
        forceUpdateRefValue(videoStatusRef, 'seeked')
      ),
      addVideoEventListener('ended', () =>
        forceUpdateRefValue(videoStatusRef, 'ended')
      ),

      addVideoEventListener('playing', () => {
        clearTimeout(waitingStatusTimer)
        forceUpdateRefValue(playStatusRef, 'playing')
      }),
      addVideoEventListener('pause', () => {
        clearTimeout(waitingStatusTimer)
        forceUpdateRefValue(playStatusRef, 'paused')
      }),
      addVideoEventListener('waiting', () => {
        waitingStatusTimer = window.setTimeout(() => {
          forceUpdateRefValue(playStatusRef, 'waiting')
        }, 500)
      }),

      addVideoEventListener('seeking', forceUpdate),
      addVideoEventListener('seeked', forceUpdate),
      addVideoEventListener('timeupdate', forceUpdate),
      addVideoEventListener('durationchange', forceUpdate),
      addVideoEventListener('volumechange', forceUpdate),
      addVideoEventListener('ratechange', forceUpdate),
    ]
    return () => {
      clearTimeout(waitingStatusTimer)
      removeListeners.forEach(remove => remove())
    }
  }, [])

  const forceUpdateRefValue = <T>(ref: React.MutableRefObject<T>, value: T) => {
    if (ref.current !== value) {
      ref.current = value
      forceUpdate()
    }
  }

  const addVideoEventListener = <K extends keyof HTMLVideoElementEventMap>(
    type: K,
    listener: (event: HTMLVideoElementEventMap[K]) => void
  ) => {
    videoRef.current?.addEventListener(type, listener)
    return function removeListener() {
      videoRef.current?.removeEventListener(type, listener)
    }
  }

  const videoControls = React.useMemo<VideoControls>(
    () => ({
      get element() {
        return videoRef.current
      },
      set currentTime(value: number) {
        if (videoRef.current) {
          videoRef.current.currentTime = value
        }
      },
      get currentTime() {
        return videoRef.current?.currentTime ?? 0 /* default value */
      },
      async play() {
        return videoRef.current?.play()
      },
      pause() {
        return videoRef.current?.pause()
      },
      set muted(value: boolean) {
        forceUpdate()
        if (videoRef.current) {
          videoRef.current.muted = value
        }
      },
      get muted() {
        return videoRef.current?.muted ?? defaultMute
      },
      get duration() {
        return videoRef.current?.duration ?? 0 /* default value */
      },
      set volume(value: number) {
        this.muted = value === 0
        if (videoRef.current) {
          videoRef.current.volume = value
        }
      },
      get volume() {
        return videoRef.current?.volume ?? defaultVolume
      },
      set playbackRate(value: number) {
        if (videoRef.current) {
          videoRef.current.playbackRate = value
        }
      },
      get playbackRate() {
        return videoRef.current?.playbackRate ?? defaultPlayRate
      },
      set loop(value: boolean) {
        forceUpdate()
        if (videoRef.current) {
          videoRef.current.loop = value
        }
      },
      get loop() {
        return videoRef.current?.loop ?? defaultLoop
      },
      get paused() {
        return !!videoRef.current?.paused
      },
      async requestPictureInPicture() {
        return videoRef.current?.requestPictureInPicture()
      },
      exitPictureInPicture() {
        return document.exitPictureInPicture()
      },
      async requestFullScreen(options?: FullscreenOptions) {
        return videoRef.current?.requestFullscreen(options)
      },
      exitFullscreen() {
        return document.exitFullscreen()
      },
      get status() {
        return videoStatusRef.current
      },
      get playStatus() {
        return playStatusRef.current
      },
    }),
    []
  )

  return [videoControls, videoRef] as const
}
