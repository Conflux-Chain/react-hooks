import { useState, useRef } from "react"
import { useEffectOnce } from "react-use"
import { onBrowser } from "./ssr-helper.js"

let CONFLUXJS_INTERVAL_DEFINED = false

export default (customInterval = 100) =>
  onBrowser(
    () => {
      const [defined, setDefined] = useState(
        CONFLUXJS_INTERVAL_DEFINED || Boolean(window?.confluxJS)
      )
      const intervalRef = useRef(null)
      useEffectOnce(() => {
        if (!defined) {
          intervalRef.current = setInterval(() => {
            if (window?.confluxJS) {
              setDefined(true)
              clearInterval(intervalRef.current)
            }
          }, customInterval)
        }

        return () => {
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      })

      return defined
    },
    () => false
  )
