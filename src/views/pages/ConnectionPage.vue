<template>
  <div class="main">
    <ul class="main-left">
      <li v-for="item in menuList" :key="item.id" :draggable="true" @dragend="handleDragend($event, item)">{{item.label}}</li>
    </ul>
    <div class="main-right" @dragover.prevent ref="efContainerRef" id="efContainer" >
      <div v-for="(item, index) in nodeList" :key="item.nodeId" :draggable="true" class="node-info flow-node-drag"
        :style="item.nodeContainerStyle" :id="item.nodeId" :ref="el => nodeRef[index] = el"
        @mousemove="handleMousemove($event, item) "  @mousedown="handleMousedown(item,$event)"  @dragover.prevent    >
        <div class="node-info-label">{{item.label}}</div>
        <span class="node-drag"></span>
      </div>
      <el-button type="danger" plain class="clear" @click="clearConnections" size="large">清除</el-button>
    </div>
  </div>
</template>
<script setup >
import { onMounted, nextTick, ref, onBeforeUnmount } from 'vue'
import { jsPlumb } from 'jsplumb'

const menuList = ref([{ label: 'fund', id: '1' }, { label: 'despite', id: '2' }, { label: 'facility', id: '3' }, { label: 'victim', id: '4' },
  { label: '受害者', id: '5' }, { label: '天赋', id: '6' }, { label: '基金', id: '7' }, { label: '不管，不顾', id: '8' }])

const deff = {
  jsplumbSetting: {
    // 动态锚点、位置自适应
    Anchors: ['Right', 'Left'],
    anchor: ['Right', 'Left'],
    // 容器ID 是指定了连接线的容器的 ID。
    Container: 'efContainer',
    // 连线的样式，直线或者曲线等，可选值:  StateMachine、Flowchart，Bezier、Straight
    Connector: ['Bezier', { curviness: 100 }],
    // 鼠标不能拖动删除线
    ConnectionsDetachable: true,
    // 删除线的时候节点不删除
    DeleteEndpointsOnDetach: false,
    /**
         * 空白端点
         */
    // Endpoint: ['Dot', { radius: 5, cssClass: 'ef-dot', hoverClass: 'ef-dot-hover' }],
    Endpoint: ['Blank', { Overlays: '' }],
    /**
         * 连线的两端端点样式
         * fill: 颜色值，如：#12aabb，为空不显示
         * outlineWidth: 外边线宽度
         */
    EndpointStyle: { fill: '##FFB6C1', outlineWidth: 1 },
    // 是否打开jsPlumb的内部日志记录
    LogEnabled: true,
    /**
         * 连线的样式
         */
    PaintStyle: {
      // 线的颜色
      stroke: '#FFB6C1',
      // 线的粗细，值越大线越粗
      strokeWidth: 5,
      // 设置外边线的颜色，默认设置透明，这样别人就看不见了，点击线的时候可以不用精确点击，参考 https://blog.csdn.net/roymno2/article/details/72717101
      outlineStroke: 'transparent',
      // 线外边的宽，值越大，线的点击范围越大
      outlineWidth: 10
    },
    // cursor: 'pointer' 定义了拖拽端点时鼠标的样式。在这里，设置为 pointer，表示当用户将鼠标移动到端点上时，鼠标会变为手型的指针，表示该端点可以被拖拽。
    // zIndex: 2000 表示了拖拽端点时的层叠顺序。在这里，设置为 2000，表示端点拖拽时会被置于其他元素的前面，并且在层叠顺序上具有较高的优先级。
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
    ConnectionOverlays: [
      ['Custom', {
        create () {
          const el = document.createElement('div')
          // el.innerHTML = '<select id=\'myDropDown\'><option value=\'foo\'>foo</option><option value=\'bar\'>bar</option></select>'
          return el
        },
        location: 0.7,
        id: 'customOverlay'
      }]
    ],
    /**
         *  叠加 参考： https://www.jianshu.com/p/d9e9918fd928
         */
    Overlays: [
      // 箭头叠加
      ['Arrow', {
        width: 20, // 箭头尾部的宽度
        length: 10, // 从箭头的尾部到头部的距离
        location: 1, // 位置，建议使用0～1之间
        direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
        foldback: 0.623 // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
      }],
      // ['Diamond', {        //     events: {        //         dblclick: function (diamondOverlay, originalEvent) {        //             console.log('double click on diamond overlay for : ' + diamondOverlay.component)        //         }        //     }        // }],
      ['Label', { label: '', location: 0.1, cssClass: 'aLabel' }]

    ],
    // 绘制图的模式 svg、canvas
    RenderMode: 'canvas',
    // 鼠标滑过线的样式
    HoverPaintStyle: { stroke: '#b0b2b5', strokeWidth: 3 },
    // 滑过锚点效果
    // EndpointHoverStyle: {fill: 'red'}
    Scope: 'jsPlumb_DefaultScope' // 范围，具有相同scope的点才可连接
  },
  /**
     * 连线参数
     */
  jsplumbConnectOptions: {
    isSource: true,
    isTarget: true,
    // 动态锚点、提供了4个方向 Continuous、AutoDefault
    // anchor: 'Continuous',
    // anchor: ['Continuous', { faces: ['left', 'right'] }],
    // 设置连线上面的label样式
    labelStyle: {
      cssClass: 'flowLabel'
    }
  },
  /**
     * 源点配置参数
     */
  jsplumbSourceOptions: {
    // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
    filter: '.node-drag',
    filterExclude: false,
    anchor: ['Continuous', { faces: ['right'] }],
    // 是否允许自己连接自己
    allowLoopback: false,
    maxConnections: -1
  },
  // 参考 https://www.cnblogs.com/mq0036/p/7942139.html
  jsplumbTargetOptions: {
    // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
    filter: '.node-drag',
    filterExclude: false,
    // 是否允许自己连接自己
    anchor: ['Continuous', { faces: ['left'] }],
    allowLoopback: false,
    dropOptions: { hoverClass: 'ef-drop-hover' }
  }
}

const nodeList = ref([])
const efContainerRef = ref()
const nodeRef = ref([])

let plumbIns

const jsPlumbInit = () => {
  plumbIns.importDefaults(deff.jsplumbSetting)
}

const handleDragend = (ev, node) => {
  // 拖拽进来相对于地址栏偏移量
  const evClientX = ev.clientX
  const evClientY = ev.clientY
  const efContainer = efContainerRef.value
  // const containerRect = efContainer.getBoundingClientRect()
  // 计算节点在容器中的位置：
  let left = evClientX - efContainer.offsetLeft
  let top = evClientY - efContainer.offsetTop
  // 居中
  left -= 51
  top -= 19
  const nodeId = `${node.id}_${Date.now()}`
  const nodeInfo = {
    label: node.label,
    id: nodeId,
    nodeId,
    nodeContainerStyle: {
      left: left + 'px',
      top: top + 'px'
    }
  }
  nodeList.value.push(nodeInfo)
  nextTick(() => {
    plumbIns.makeSource(nodeId, deff.jsplumbSourceOptions)
    plumbIns.makeTarget(nodeId, deff.jsplumbTargetOptions)
    plumbIns.draggable(nodeId)
  })
}
const handleMousemove = (ev, node) => {
  const efContainer = efContainerRef.value
  const mouseXOffset = ev.clientX - mousePressedX.value
  const mouseYOffset = ev.clientY - mousePressedY.value
  const newNodeX = Math.max(0, Math.min(efContainer.offsetWidth - node.offsetWidth, node.left + mouseXOffset))
  const newNodeY = Math.max(0, Math.min(efContainer.offsetHeight - node.offsetHeight, node.top + mouseYOffset))
  node.nodeContainerStyle = {
    top: `${newNodeY}px`,
    left: `${newNodeX}px`
  }
}
const mousePressedX = ref(0)
const mousePressedY = ref(0)
const handleMousedown = (node, ev) => {
  const x = ev.clientX
  const y = ev.clientY
  node.left = node.nodeContainerStyle && node.nodeContainerStyle.left ? parseInt(node.nodeContainerStyle.left) : 0
  node.top = node.nodeContainerStyle && node.nodeContainerStyle.top ? parseInt(node.nodeContainerStyle.top) : 0
  mousePressedX.value = x
  mousePressedY.value = y
}
const clearConnections = () => {
  // 删除所有连接线
  plumbIns.deleteEveryConnection()
}
// 在组件挂载后执行逻辑
onMounted(() => {
  plumbIns = jsPlumb.getInstance()// 是用来获取全局唯一的 jsPlumb 实例对象的方法
  jsPlumbInit()
})
onBeforeUnmount(() => {
  if (plumbIns) {
    plumbIns.reset() // 在组件卸载前重置 jsPlumb 实例
  }
})
</script>
<style  scoped>
html,
body {
  height: 100%;
  margin: 0;
}
  #source {
    border: 2px solid #b8f1cc;
  }
  #target {
    border: 2px solid #b8f1cc;
  }
  .main {
    display: flex;
    flex-direction: row;
  height: 100%;
  }
  .main-left {
    /* flex: 0.2; 左侧区域占据剩余空间 */
    flex: 0.2; /* 根据需要设置布局权重，这样它们可以自适应宽度 */
  width: 0; /* 设置宽度为 0，由 flex 属性决定宽度 */
    background-color: #FFCAD4; /* 左侧区域背景颜色 */
    /* height: 100%; */
  }
  .main-left li {
    white-space: normal; /* 或者其他的 overflow 属性值，如 scroll 或 auto */
}
  .main-right {
    /*flex: 2;  右侧区域占据剩余空间的两倍 */
    flex: 0.8; /* 根据需要设置布局权重，这样它们可以自适应宽度 */
    width: 0; /* 设置宽度为 0，由 flex 属性决定宽度 */
    background-color: #FFCAD4; /* 右侧区域背景颜色 */
    position: relative; /* 让右侧容器相对定位 */
    overflow: auto; /* 让容器内容超出部分可以滚动 */
    border:10px solid #FFFFFF;
    border-radius: 40px;
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-style: italic;
     /* position: relative;
     height: 100%; */
  }
  ul {
    list-style: none;
    padding-left: 0;
    width: 120px;
    background: #f1b8f1;
    text-align: center;
    margin: 0;
    border:10px solid #FFFFFF;
    border-radius: 40px;
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-style: italic;
  }
  ul > li {
    height: 80px;
    line-height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .node-info {
    position: absolute;
  }
  .node-info-label {
    width: 100px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border: 5px solid #f1b8f1;
    border-radius: 40px;
    background: #f1b8f1;
    border-radius: 4px;
  }
  .node-info-label:hover {
    cursor: pointer;
    background: #f1b8f1;
  }
  .node-info-label:hover + .node-drag {
    display: inline-block;
  }
  .node-drag {
    display: none;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    border: 1px solid #f1b8f1;
    position: absolute;
    right: -7px;
    top: 14px;
    background-color: black;
  }
  .node-drag:hover {
    display: inline-block;
  }
.clear{
  width: 100px;
position: absolute;
right: 50px;
top: 30px;
font-weight: bold;
font-size: larger;
border: 2px solid;
}
</style>
