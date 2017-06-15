import * as NotifyActions from './NotifyActions.js'
import * as constants from '../constants.js'
import Promise from 'bluebird'
import callId from '../callId.js'
import getUserMedia from '../window/getUserMedia.js'
import handshake from '../peer/handshake.js'
import socket from '../socket.js'

export const init = () => dispatch => ({
  type: constants.INIT,
  payload: Promise.all([
    connect()(dispatch),
    getCameraStream()(dispatch)
  ])
  .spread((socket, stream) => {
    handshake.init({ socket, callId, stream })
  })
})

export const connect = () => dispatch => {
  return new Promise(resolve => {
    socket.once('connect', () => {
      dispatch(NotifyActions.warn('Connected to server socket'))
      resolve(socket)
    })
    socket.on('disconnect', () => {
      dispatch(NotifyActions.error('Server socket disconnected'))
    })
  })
}

export const getCameraStream = () => dispatch => {
  return getUserMedia({ video: true, audio: true })
  .then(stream => {
    dispatch(addStream({ stream, userId: constants.ME }))
    return stream
  })
  .catch(() => {
    dispatch(NotifyActions.alert('Could not get access to microphone & camera'))
    return null
  })
}

export const addStream = ({ stream, userId }) => ({
  type: constants.STREAM_ADD,
  payload: {
    userId,
    stream
  }
})

export const removeStream = userId => ({
  type: constants.STREAM_REMOVE,
  payload: { userId }
})

export const activateStream = userId => ({
  type: constants.STREAM_ACTIVATE,
  payload: { userId }
})
