import { useEvent } from "react-use"
import { useState, useEffect } from "react"
import { useConfluxJSDefined } from "./"
import { isSSR } from "./ssr-helper.js"

let EPOCH_NUMBER_UPDATED_EVENT_DATA = { detail: undefined }
let EPOCH_NUMBER_UPDATED_EVENT = null

function dispatchEpochNumberUpdated() {
  if (!EPOCH_NUMBER_UPDATED_EVENT)
    EPOCH_NUMBER_UPDATED_EVENT = new CustomEvent(
      "epochNumberUpdated",
      EPOCH_NUMBER_UPDATED_EVENT_DATA
    )

  window?.confluxJS?.getEpochNumber()?.then((epochNumber) => {
    if (EPOCH_NUMBER_UPDATED_EVENT_DATA.detail === epochNumber) return
    EPOCH_NUMBER_UPDATED_EVENT_DATA.detail = epochNumber
    window.dispatchEvent(EPOCH_NUMBER_UPDATED_EVENT)
  }).catch(error=>{
    console.warn(error)
  })
}

/**
 * setup a listener to trigger a epochNumberUpdated event
 * @param {number=3000} interval the interval to detect epoch number change
 */
export function setupEpochListener(interval = 3000) {
  if (isSSR()) return
  if (!window || !window.confluxJS) return
  if (window.__EPOCH_NUMBER_UPDATED_EVENT_INTERVAL !== undefined)
    clearInterval(__EPOCH_NUMBER_UPDATED_EVENT_INTERVAL)
  dispatchEpochNumberUpdated()
  window.__EPOCH_NUMBER_UPDATED_EVENT_INTERVAL = setInterval(
    dispatchEpochNumberUpdated,
    interval
  )
}

/**
 * hook to get the current epoch number, trigger rerender when epoch number changes
 * @returns {number|undefined} current epoch number or undefined
 */
export function useEpochNumber() {
  const confluxJSDefined = useConfluxJSDefined()
  useEffect(() => {
    if (confluxJSDefined) setupEpochListener()
  }, [confluxJSDefined])

  const [epochNumber, setEpochNumber] = useState(
    EPOCH_NUMBER_UPDATED_EVENT_DATA.detail
  )
  useEvent("epochNumberUpdated", () => {
    setEpochNumber(EPOCH_NUMBER_UPDATED_EVENT_DATA.detail)
  })

  return epochNumber
}

export const useEpochNumberFn = (cb) =>
  useEvent("epochNumberUpdated", cb(EPOCH_NUMBER_UPDATED_EVENT_DATA.detail))
