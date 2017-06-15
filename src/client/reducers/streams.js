import * as constants from '../constants.js'
import createObjectURL from '../window/createObjectURL'
import Immutable from 'seamless-immutable'

const defaultState = Immutable({
  active: null,
  all: {}
})

function addStream (state, action) {
  const { userId, stream } = action.payload
  const streams = state.all.merge({
    [userId]: {
      userId,
      stream,
      url: createObjectURL(stream)
    }
  })
  return { active: userId, streams }
}

function removeStream (state, action) {
  const streams = state.all.without(action.payload.userId)
  return state.merge({ streams })
}

export default function streams (state = defaultState, action) {
  switch (action && action.type) {
    case constants.STREAM_ADD:
      return addStream(state, action)
    case constants.STREAM_ACTIVATE:
      return state.merge({ active: action.payload.userId })
    case constants.STREAM_REMOVE:
      return removeStream(state, action)
    default:
      return state
  }
}
