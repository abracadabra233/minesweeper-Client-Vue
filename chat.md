你现在是一个优秀的JavaScript前端程序员，采用的技术栈为Vue3+vue-router+Vuex 请用中文和我对话，并遵循以下原则‘‘Let's work this out in a step by step way to be sure we have the right answer’’，此外，每次回复都应当尽可能的精简高效。请根据我下面的需求给出实现

程序包含四个页面，初始页面，房间等待页面，游戏页面，游戏结束页面，初始页面：包含一个创建房间和加入房间两个按钮，右上显示当前用户的头像，点击头像会显示id和name信息；房间等待页面：包含一个玩家列表，该列表显示每个玩家的头像和name，还会显示房间号；游戏页面：游戏页面为扫雷的游戏页面，包含扫雷游戏的基本元素，但不需要扫雷的逻辑，只需要根据服务端传递的三个值cols，rows，mines进行初始化；游戏结束页面：包含扫雷游戏，游戏结束时的基本元素

游戏的初始页面，包含一个创建房间和加入房间两个按钮。点击创建房间的逻辑如下:向"ws://127.0.0.1:3000/ws 请求websocket连接，如果连接成功 就发送如下格式的数据，player来自玩家当前的信息，config通过弹出三个输入框，并由用户输入获得
                { 
                    "type": "InitRoom",
                    "player": {
                        "id": "id",
                        "name": "name",
                        "icon": "icon",  # 玩家头像的base64编码
                    },
                    "config": {
                        "cols": 10,
                        "rows": 10,
                        "mines": 16,
                    },
                }                
点击加入房间的逻辑如下:向"ws://127.0.0.1:3000/ws 请求websocket连接，如果连接成功 就发送如下格式的数据，player来自玩家当前的信息，room_id通过弹出的输入框，并由用户输入获得
                {
                    "type": "JoinRoom",
                    "room_id": "66666",
                    "player": {
                        "user_id": "user_id2",
                        "user_name": "user_name2",
                        "user_icon": "user_icon2",
                    },
                }

创建房间 或者加入房间成功后， 服务端会返回一个enum ResponseModel 
    // 该消息不广播，玩家加入前，有哪些玩家
    JoinRoom {
        players: Vec<Player>,
        room_id: String,
    },  JoinRoom包含房间内已经有的玩家，如果是创建房间，则players为空。 当接受到改消息后应该跳转到 WaitingRoom 界面，该页面会显示一个玩家列表，显示每个玩家的name和头像

此外，新玩家加入房间后，服务端还会给已经连接的处于等待页面的玩家广播一个NewPlayerJoin消息，表示有新的玩家加入，并将新玩家的信息加在玩家列表后面
    // 广播新玩家加入
    NewPlayerJoin {
        player: Player,
    }, 消息，表示新玩家




成功连接后，便需要监听来自服务端的消息了, 服务端为rust，可能返回的消息如下：
enum ResponseModel {
    // 该消息不广播，玩家加入前，有哪些玩家
    JoinRoom {
        players: Vec<Player>,
        room_id: String,
    },
    // 广播新玩家加入
    NewPlayerJoin {
        player: Player,
    },
    // 玩家齐了，游戏开始
    GameStart {
        players: Vec<Player>,
        cols: usize,  // 棋盘宽度
        rows: usize,  // 棋盘高度
    },
    // 玩家操作后，需要改变的信息
    GameOpRes {
        op_res: OpResult,
    },
    // 游戏异常：玩家离开，房间丢失等
    InvalidRequest {
        error: String,
    },
}
JoinRoom表示当前玩家成功加入房间，players表示房间中已经有哪些玩家了，room_id表示房间id，客户端收到改消息后，边进入一个等待页面，改页面有一个玩家列表，显示房间内所有玩家（需要把当前玩家插入在最后）的信息，包括头像和name
NewPlayerJoin表示有新的玩家加入房间，这时就在 玩家列表 后面插入新加入的玩家信息
GameStart 表示玩家齐了，游戏开始，此时进入游戏界面：根据cols，rows来初始化棋盘，这是一个扫雷游戏，也就是初始化一个 cols*rows的网格，每个网格都可以点击，点击之后会通过之前的websocket连接来发送以下格式如下数据：
pub struct PlayerAction {
    pub x: usize,
    pub y: usize,
    pub f: bool,
}
x，y 表示点击的坐标，f 表示是否是鼠标右键点击
GameOpRes 表示房间内其他玩家，对棋盘进行操作后的操作结果，其具体的信息如下，对Success的操作结果，应该解析其中的CellInfos 信息，并将改信息实时同步到棋盘上，请帮我完善GameOver和GameWon的情况
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CellInfo {
    pub x: usize,
    pub y: usize,
    pub status: CellState,
}
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type")]
pub enum OpResult {
    Success(Vec<CellInfo>), // 操作成功，返回操作影响的cell信息
    GameOver,               // 游戏失败，踩到雷
    GameWon,                // 游戏胜利
}
请完善InvalidRequest情况

玩家点击格子后，服务端会广播如下的GameOpRes信息，表示哪些格子的状态会发生改变，或者是游戏结束，请完善store中的 ws.onmessage = (event) => 将这些信息实时同步在棋盘上（如果是Closed，就恢复到初始样式；如果是Opened，则显示a_mines，表示周围雷的数量；如果是Marked，就插上一个旗子），如果是游戏结束（GameOver或者GameWon）则弹出窗口提示

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type")]
enum ResponseModel {
GameOpRes {
        op_res: OpResult,
    },
XXX，
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type")]
pub enum OpResult {
    Success(Vec<CellInfo>), // 操作成功，返回操作影响的cell信息
    GameOver,               // 游戏失败，踩到雷
    GameWon,                // 游戏胜利
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CellInfo {
    pub x: usize,
    pub y: usize,
    pub status: CellState,
}


#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq)]
#[serde(tag = "type")]
pub enum CellState {
    Closed,                 // 单元格未打开
    Opened { a_mines: u8 }, // 单元格已打开
    Marked,                 // 单元格被标记为雷
}


// 这是一个rust实现的多人在线扫雷的核心逻辑，请通过增加结构体或是修改函数实现，帮我完善以下逻辑：1.op函数表示用户点击x，y出的格子，is_flaged表示是否是进行插旗操作，这个函数应该返回用户这次操作后，旗子上哪些cell的状态会发送改变，或者是游戏结束（失败或成功，成功需返回相应的信息），请将上述返回的信息封装在一个 enum 中 ，并返回

// 这是一个rust实现的多人在线扫雷的服务端，请根据上面的注释优化上述代码，并给出优化建议，包括但不限于以下方面：1. 变量函数命名；2. 逻辑。 还给出一些你认为需要优化的地方


websocket.js  需要处理从服务端接收到的消息，并更新相应的状态。
服务端的信息包括以下几种
// 服务端广播给客户端的消息
#[derive(Serialize, Debug, Clone)]
#[serde(tag = "type")]
enum ResponseModel {
    JoinSuccess { players: Vec<Player>, room_id: String }, // 不广播，玩家加入成功
    PlayerJoin { player: Player },                         // 广播新玩家加入
    PlayerLeft { player_id: String },                      // 广播新玩家离开
    PlayerStatusSet { player_id: String, is_ready: bool }, // 玩家准备取消准备
    GameStart { config: GameConfig },                      // 玩家齐了，游戏开始
    GameOpRes { player_id: String, op_res: OpResponse },   // 玩家操作后，需要改变的信息
    InvalidRequest { error: String },                      // 异常：玩家离开，房间丢失等
}
// vuex 中需要维护的状态包括
// Vuex 4 store definition compatible with Vue 3
export default createStore({
  state() {
    return {
      ws: null, // 用于存储WebSocket连接
      roomInfo: {
        players: [],
        room_id: "",
      },
      player: {
        id: generateRandomId(),
        name: generateRandomName(),
        icon: createAvatar(adventurerNeutral, {
          seed: generateRandomId(),
        }).toString(),
        is_ready: false
      },
      gameConfig: null,
      gameBoard: [],
    };
  },
现在每个页面就只负责在websocket中发消息，以及以响应式的方式渲染 vuex中维护的状态；websocket.js 和 src/store/index.js 负责处理websocket中收到的消息，但这种模块方式感觉解耦不够，请帮我调整，设计一个新的 更完善的结构



 让我们使用bootstrap 的组件库来优化这个页面 ，让其有更漂亮的界面，更好交互性，更好兼容性（每个cell任何时候都是正方形），在手机上显示不全时 ，可以上下左右滑动；此外，请通过bootstrap在右边添加一排按钮（通过Collapse）组件实现，包括两个按钮：改变难度，再来一局），在pc端页面足够时 就 展示出来，页面不足时 就 隐藏起来，可以通过一个可滑动的小箭头 划出来；在游戏板的右上方，加一个计时器；左上方，加一个旗子计数器；计数器和计时器在同一行。请保持以下原则，尽可能的少自定义样式，尽可能的多的用bootstrap中的组件，JavaScript最好只用于 游戏逻辑，不要用于设置样式

