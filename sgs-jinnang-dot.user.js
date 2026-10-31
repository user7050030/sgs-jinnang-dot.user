// ==UserScript==
// @name         三国杀·锦囊袋圆点入口
// @namespace    https://github.com/user7050030/sgs-jinnang-dot.user
// @version      1.0.0
// @description  把锦囊袋收起态的胶囊入口改成三个点的圆形小按钮，保留原有展开/收起和拖动。
// @author       锦囊妙计插件
// @match        https://game.4399iw2.com/yxxsgs/*
// @match        *://*.sanguosha.com/10/*
// @match        *://*.sanguosha.com/x/*
// @match        *://*.sanguosha.com/10th/*
// @match        https://wan.baidu.com/*gameId=19793616*
// @match        *://h5.7k7k.com/web/H5GAMES.html?gid=960982bec2f555de44ea43ca8a7ef418/*
// @match        *://qqgame.qq.com/webappframe/?appid=10951
// @match        *://s118.app1107877410.qqopenapp.com/pc/qqLobby_index.php*
// @match        *://kuaiwan.com/game/main/9496000/*
// @match        *://kuaiwan.com/start/game.html*
// @match        *://sgsszn.wan.360.cn/*
// @exclude      *://*.sanguosha.com/220/*
// @grant        none
// ==/UserScript==

(() => {
  'use strict';
  if (window.__SGS_JINNANG_DOT__) return;
  window.__SGS_JINNANG_DOT__ = true;

  const CSS_ID = 'jnd-mini-css';
  const PIPS_ID = 'jnd-mini-pips';

  function ensureStyle() {
    if (document.getElementById(CSS_ID)) return;
    const host = document.head || document.documentElement;
    if (!host) return;
    const style = document.createElement('style');
    style.id = CSS_ID;
    style.textContent = `
      /* 收起态只留一个圆点：面板皮肤/内容透明化，并把整块面板从命中测试里摘掉 */
      #jnd-panel.jnd-mini-dot:not(.open) { pointer-events: none !important; }
      #jnd-panel.jnd-mini-dot:not(.open)::before { opacity: 0 !important; }
      #jnd-panel.jnd-mini-dot:not(.open) .jnd-face-front { opacity: 0 !important; }
      #jnd-panel.jnd-mini-dot:not(.open)::after { opacity: 0 !important; }
      #jnd-panel.jnd-mini-dot:not(.open) .jnd-panel-collapse { pointer-events: none !important; }

      #jnd-mini-pips {
        position: absolute; left: 18px; top: 18px; z-index: 9;
        width: 26px; height: 26px; box-sizing: border-box;
        display: none; align-items: center; justify-content: center; gap: 3px;
        border-radius: 50%; pointer-events: none;
        background: radial-gradient(circle at 34% 28%, rgba(60, 49, 36, .98), rgba(18, 15, 11, .94) 74%);
        border: 1px solid rgba(214, 173, 78, .68);
        box-shadow: 0 0 0 1px rgba(0, 0, 0, .34), 0 2px 8px rgba(0, 0, 0, .5), 0 0 10px rgba(214, 173, 78, .16);
        transition: border-color .16s ease, box-shadow .16s ease;
      }
      /* 命中区域只剩这 26px 圆点，点击冒泡回面板后仍走原来的展开逻辑 */
      #jnd-panel.jnd-mini-dot:not(.open) #jnd-mini-pips { display: flex; pointer-events: auto; }
      #jnd-mini-pips:hover {
        border-color: rgba(238, 205, 128, .95);
        box-shadow: 0 0 0 1px rgba(0, 0, 0, .34), 0 2px 8px rgba(0, 0, 0, .5), 0 0 14px rgba(230, 190, 100, .3);
      }
      /* 锦囊袋允许拖到右侧停靠，停靠后可见区域在面板右上角 */
      #jnd-panel.jnd-mini-dot.jnd-dock-right:not(.open) #jnd-mini-pips {
        left: auto; right: calc(var(--jnd-entry-w, 200px) - 44px);
      }
      #jnd-mini-pips i {
        width: 3px; height: 3px; border-radius: 50%;
        background: #e6c37c; box-shadow: 0 0 4px rgba(230, 195, 124, .55);
      }
      /* 有新内容时在圆点右上角留一颗小金星，替代原来的顶边金线 */
      #jnd-panel.jnd-mini-dot.jnd-dot-update:not(.open) #jnd-mini-pips::after {
        content: ""; position: absolute; right: -1px; top: -1px;
        width: 5px; height: 5px; border-radius: 50%;
        background: #e6c37c; box-shadow: 0 0 5px rgba(230, 195, 124, .8);
      }
    `;
    host.appendChild(style);
  }

  function ensurePips(panel) {
    let pips = document.getElementById(PIPS_ID);
    if (pips && pips.parentElement === panel) return;
    if (pips) pips.remove();
    pips = document.createElement('div');
    pips.id = PIPS_ID;
    pips.setAttribute('aria-hidden', 'true');
    pips.innerHTML = '<i></i><i></i><i></i>';
    panel.appendChild(pips);
  }

  function tick() {
    const panel = document.getElementById('jnd-panel');
    if (!panel) return;
    ensureStyle();
    if (!panel.classList.contains('jnd-mini-dot')) panel.classList.add('jnd-mini-dot');
    ensurePips(panel);
  }

  setInterval(tick, 300);
})();
