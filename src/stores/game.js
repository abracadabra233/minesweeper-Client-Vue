import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adventurerNeutral } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

// 工具函数
const generateRandomId = () => Math.floor(Math.random() * 10000).toString()

const generateRandomName = () => {
  const names = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eli', 'Fiona', 'Grace', 'Henry', 'Ivy', 'Jack']
  return names[Math.floor(Math.random() * names.length)]
}

const getCurPlayer = () => ({
  id: generateRandomId(),
  name: generateRandomName(),
  icon: createAvatar(adventurerNeutral, { seed: generateRandomId() }).toString(),
  is_ready: false,
})

export const useGameStore = defineStore('game', () => {
  // 状态
  const ws = ref(null)
  const roomInfo = ref({ players: {}, room_id: '' })
  const curPlayer = ref(getCurPlayer())
  const gameConfig = ref(null)
  const flagCount = ref(0)
  const gameBoard = ref([])
  const gameStatus = ref('None') // Waiting, Gaming
  const gameEndFlag = ref('None') // GameWin, GameOver
  const winInfo = ref(null)

  // 计算属性
  const isConnected = computed(() => ws.value && ws.value.readyState === WebSocket.OPEN)
  const isGameActive = computed(() => gameStatus.value === 'Gaming')
  const isWaiting = computed(() => gameStatus.value === 'Waiting')
  const isGameOver = computed(() => gameEndFlag.value === 'GameOver')
  const isGameWin = computed(() => gameEndFlag.value === 'GameWin')

  // 方法
  const initWebSocket = () => {
    return new Promise((resolve, reject) => {
      if (isConnected.value) {
        resolve()
        return
      }

      const url = import.meta.env.VITE_WEBSOCKET_URL
      const websocket = new WebSocket(url)

      websocket.onopen = () => {
        console.log('WebSocket connection established')
        ws.value = websocket
        resolve()
      }

      websocket.onerror = (error) => {
        console.error('WebSocket connection error:', error)
        reject(error)
      }

      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          if (message && message.type) {
            console.log(`Recv message | ${message.type} |`, message)
            handleWebSocketMessage(message)
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      websocket.onclose = (event) => {
        console.log('WebSocket closed by server', event)
        ws.value = null
      }
    })
  }

  const sendMessage = async (message) => {
    console.log(`Send message | ${message.type} |`, message)
    try {
      await initWebSocket()
      ws.value.send(JSON.stringify(message))
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'JoinSuccess':
        handleJoinSuccess(message)
        break
      case 'PlayerJoin':
        handlePlayerJoin(message)
        break
      case 'PlayerLeft':
        handlePlayerLeft(message)
        break
      case 'PlayerStatusSet':
        handlePlayerStatusSet(message)
        break
      case 'GameStart':
        handleGameStart(message)
        break
      case 'GameOpRes':
        handleGameOpRes(message)
        break
      case 'InvalidRequest':
        console.error('InvalidRequest:', message.error)
        break
      default:
        console.warn('Unknown message type:', message.type)
    }
  }

  const handleJoinSuccess = ({ players, room_id }) => {
    roomInfo.value.room_id = room_id
    players.forEach((player) => {
      roomInfo.value.players[player.id] = player
    })
    roomInfo.value.players[curPlayer.value.id] = curPlayer.value
    gameStatus.value = 'Waiting'
  }

  const handlePlayerJoin = ({ player }) => {
    roomInfo.value.players[player.id] = player
  }

  const handlePlayerLeft = ({ player_id }) => {
    delete roomInfo.value.players[player_id]
  }

  const handlePlayerStatusSet = ({ player_id, is_ready }) => {
    if (roomInfo.value.players[player_id]) {
      roomInfo.value.players[player_id].is_ready = is_ready
    }
    if (player_id === curPlayer.value.id) {
      curPlayer.value.is_ready = is_ready
    }
  }

  const handleGameStart = ({ config }) => {
    gameConfig.value = config
    gameBoard.value = Array.from({ length: config.rows }, () =>
      Array.from({ length: config.cols }, () => ({ status: 'Closed', a_mines: 0 }))
    )
    gameStatus.value = 'Gaming'
    flagCount.value = 0
    gameEndFlag.value = 'None'
  }

  const handleGameOpRes = ({ player_id, op_res }) => {
    console.log(`${player_id} 操作`)

    if (op_res.OpSuccess) {
      const { cells } = op_res.OpSuccess
      cells.forEach(({ x, y, status }) => {
        const cell = gameBoard.value[x][y]
        if (status.Opened) {
          cell.a_mines = status.Opened.a_mines
          cell.status = 'Opened'
        } else if (status === 'Closed') {
          cell.status = status
          flagCount.value -= 1
        } else if (status === 'Flagged') {
          cell.status = status
          flagCount.value += 1
        }
      })
    } else if (op_res.GameOver) {
      const { mines, mine } = op_res.GameOver
      gameEndFlag.value = 'GameOver'
      mines.forEach(({ x, y }) => {
        const cell = gameBoard.value[x][y]
        if (cell.status === 'Flagged') {
          cell.status = 'Cor-Flagged'
        } else {
          cell.status = 'Boom'
        }
      })
      gameBoard.value[mine.x][mine.y].status = 'Origin-Boom'
    } else if (op_res.GameWin) {
      const { mines, cells } = op_res.GameWin.win_info
      gameEndFlag.value = 'GameWin'
      winInfo.value = op_res.GameWin.win_info

      // 显示所有需要打开的
      cells.forEach(({ x, y, status }) => {
        const cell = gameBoard.value[x][y]
        if (status.Opened) {
          cell.a_mines = status.Opened.a_mines
          cell.status = 'Opened'
        } else if (status === 'Closed' || status === 'Flagged') {
          cell.status = status
        }
      })

      // 显示所有需要标记的
      mines.forEach(({ x, y }) => {
        const cell = gameBoard.value[x][y]
        cell.status = 'Flagged'
      })
    }

    if (op_res.GameOver || op_res.GameWin) {
      for (const key in roomInfo.value.players) {
        roomInfo.value.players[key].is_ready = false
      }
      curPlayer.value.is_ready = false
      gameStatus.value = 'Waiting'
    }
  }

  const resetGame = () => {
    gameConfig.value = null
    flagCount.value = 0
    gameBoard.value = []
    gameStatus.value = 'None'
    gameEndFlag.value = 'None'
    winInfo.value = null
  }

  return {
    // 状态
    ws,
    roomInfo,
    curPlayer,
    gameConfig,
    flagCount,
    gameBoard,
    gameStatus,
    gameEndFlag,
    winInfo,

    // 计算属性
    isConnected,
    isGameActive,
    isWaiting,
    isGameOver,
    isGameWin,

    // 方法
    initWebSocket,
    sendMessage,
    resetGame,
  }
}) 