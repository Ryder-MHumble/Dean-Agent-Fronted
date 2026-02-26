#!/usr/bin/env bash
set -euo pipefail

# ── 配置 ──────────────────────────────────────────────────────────────
APP_PORT=8080
LOG_DIR="../logs"
LOG_FILE="$LOG_DIR/frontend.log"
TOTAL_STEPS=4
START_TIME=$(date +%s)

# ── 颜色 & 样式 ────────────────────────────────────────────────────────
R='\033[0m'         # Reset
BOLD='\033[1m'
DIM='\033[2m'
ITALIC='\033[3m'

# 标准色
BLACK='\033[30m'
WHITE='\033[97m'
RED='\033[91m'
GREEN='\033[92m'
YELLOW='\033[93m'
CYAN='\033[96m'
MAGENTA='\033[95m'
BLUE='\033[94m'

# 256 色 — 用于渐变 Banner（紫 → 青）
P1='\033[38;5;57m'   # deep violet
P2='\033[38;5;63m'   # violet
P3='\033[38;5;69m'   # blue-violet
P4='\033[38;5;75m'   # periwinkle
P5='\033[38;5;81m'   # sky-cyan
P6='\033[38;5;87m'   # bright cyan

# 背景高亮
BG_VIOLET='\033[48;5;57m'
BG_CYAN='\033[48;5;87m'

# ── 工具函数 ────────────────────────────────────────────────────────────
info()  { echo -e "  ${GREEN}${BOLD}✓${R}  $1"; }
warn()  { echo -e "  ${YELLOW}${BOLD}!${R}  $1"; }
err()   { echo -e "  ${RED}${BOLD}✗${R}  $1"; }
dim()   { echo -e "  ${DIM}$1${R}"; }

bar() {
  echo -e "  ${DIM}$(printf '%.0s─' {1..56})${R}"
}
thinbar() {
  echo -e "  ${P3}$(printf '%.0s·' {1..56})${R}"
}

step() {
  local idx="$1" label="$2"
  echo ""
  echo -e "  ${P2}${BOLD}▸ Step ${idx}/${TOTAL_STEPS}${R}  ${WHITE}${BOLD}${label}${R}"
  bar
}

spinner_wait() {
  local pid=$1 msg="$2"
  local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
  local i=0
  while kill -0 "$pid" 2>/dev/null; do
    printf "\r  ${CYAN}${frames[i % ${#frames[@]}]}${R}  ${DIM}${msg}${R}"
    ((i++))
    sleep 0.1
  done
  printf "\r\033[K"
}

# ── Banner ──────────────────────────────────────────────────────────────
clear
echo ""

# ASCII art — "DEAN" — 行级渐变色
echo -e "${P1}${BOLD}    ██████╗ ███████╗ █████╗ ███╗   ██╗${R}"
echo -e "${P2}${BOLD}    ██╔══██╗██╔════╝██╔══██╗████╗  ██║${R}"
echo -e "${P3}${BOLD}    ██║  ██║█████╗  ███████║██╔██╗ ██║${R}"
echo -e "${P4}${BOLD}    ██║  ██║██╔══╝  ██╔══██║██║╚██╗██║${R}"
echo -e "${P5}${BOLD}    ██████╔╝███████╗██║  ██║██║ ╚████║${R}"
echo -e "${P6}${BOLD}    ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝${R}"
echo ""
echo -e "  ${P3}$(printf '%.0s═' {1..56})${R}"
echo -e "  ${P2}${BOLD}院长智能体${R} ${DIM}·${R} ${ITALIC}${DIM}Dean AI Agent — Frontend Deploy${R}"
echo -e "  ${P3}$(printf '%.0s═' {1..56})${R}"
echo ""

# ── 系统信息 网格 ──────────────────────────────────────────────────────
_branch=$(git branch --show-current 2>/dev/null || echo 'unknown')
_node=$(node -v 2>/dev/null || echo 'N/A')
_time=$(date '+%Y-%m-%d  %H:%M:%S')

echo -e "  ${DIM}TIME${R}   ${WHITE}${_time}${R}    ${DIM}PORT${R}  ${CYAN}${BOLD}:${APP_PORT}${R}"
echo -e "  ${DIM}BRANCH${R} ${YELLOW}${_branch}${R}          ${DIM}NODE${R}  ${GREEN}${_node}${R}"
echo -e "  ${DIM}TARGET${R} ${DIM}43.98.254.243${R}"
echo ""

# ── 步骤 1 — 拉取代码 ─────────────────────────────────────────────────
step 1 "Git Pull"

git pull --ff-only && info "代码同步完成" \
  || { err "git pull 失败 — 请检查未提交的更改或网络"; exit 1; }

COMMITS_PULLED=$(git log HEAD@{1}..HEAD --oneline 2>/dev/null | wc -l | tr -d ' ')
if [ "${COMMITS_PULLED:-0}" -gt 0 ] 2>/dev/null; then
  echo ""
  dim "  拉取了 ${WHITE}${BOLD}${COMMITS_PULLED}${R}${DIM} 个新提交:"
  git log HEAD@{1}..HEAD --oneline 2>/dev/null | head -6 | while IFS= read -r line; do
    echo -e "    ${P4}›${R} ${DIM}${line}${R}"
  done
fi

# ── 步骤 2 — 依赖检测 ─────────────────────────────────────────────────
step 2 "依赖检测"

NEED_INSTALL=false

if git diff HEAD@{1} --name-only 2>/dev/null | grep -qE '^package(-lock)?\.json$'; then
  NEED_INSTALL=true
  warn "检测到 package.json / package-lock.json 变更"
fi

if [ ! -d "node_modules" ]; then
  NEED_INSTALL=true
  warn "node_modules 目录不存在"
fi

if [ "$NEED_INSTALL" = true ]; then
  info "安装依赖 (--legacy-peer-deps)…"
  npm install --legacy-peer-deps
  info "依赖安装完成"
else
  info "依赖无变化，跳过安装"
fi

# ── 步骤 3 — 构建 ─────────────────────────────────────────────────────
step 3 "生产构建"

BUILD_START=$(date +%s)
npm run build || { err "构建失败 — 请检查编译错误"; exit 1; }
BUILD_END=$(date +%s)
BUILD_DURATION=$((BUILD_END - BUILD_START))
info "构建完成  ${DIM}(${BUILD_DURATION}s)${R}"

# ── 步骤 4 — 重启服务 ─────────────────────────────────────────────────
step 4 "启动服务"

OLD_PID=$(ss -tlnp "sport = :$APP_PORT" 2>/dev/null \
  | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | head -1 || true)

if [ -n "${OLD_PID:-}" ]; then
  warn "停止旧进程 (PID: ${YELLOW}${OLD_PID}${R})"
  kill "$OLD_PID" 2>/dev/null || true
  sleep 2
  kill -0 "$OLD_PID" 2>/dev/null && kill -9 "$OLD_PID" 2>/dev/null || true
  sleep 1
fi

mkdir -p "$LOG_DIR"
nohup npm run start -- --port "$APP_PORT" --hostname 0.0.0.0 > "$LOG_FILE" 2>&1 &
NEW_PID=$!

sleep 2
if kill -0 "$NEW_PID" 2>/dev/null; then
  info "服务已启动  ${DIM}PID ${WHITE}${NEW_PID}${R}"
else
  err "服务启动失败，请检查日志:"
  tail -20 "$LOG_FILE" 2>/dev/null
  exit 1
fi

# ── 完成报告 ────────────────────────────────────────────────────────────
END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "  ${P3}$(printf '%.0s═' {1..56})${R}"
printf "  ${P5}${BOLD}✦  DEPLOY COMPLETE${R}"
echo -e "  ${DIM}耗时 ${WHITE}${TOTAL_DURATION}s${R}"
echo -e "  ${P3}$(printf '%.0s═' {1..56})${R}"
echo ""
echo -e "  ${DIM}URL${R}   ${CYAN}${BOLD}http://43.98.254.243:${APP_PORT}${R}"
echo -e "  ${DIM}PID${R}   ${WHITE}${NEW_PID}${R}"
echo -e "  ${DIM}LOG${R}   ${DIM}tail -f ${LOG_FILE}${R}"
echo ""
