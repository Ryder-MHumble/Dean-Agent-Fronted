#!/usr/bin/env bash
set -euo pipefail

# ── 配置 ─────────────────────────────────────────────────
APP_PORT=8080
LOG_DIR="../logs"
LOG_FILE="$LOG_DIR/frontend.log"

# ── 颜色 & 样式 ─────────────────────────────────────────
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'

info()  { echo -e "  ${GREEN}✓${RESET}  $1"; }
warn()  { echo -e "  ${YELLOW}!${RESET}  $1"; }
err()   { echo -e "  ${RED}✗${RESET}  $1"; }
step()  { echo -e "\n  ${CYAN}${BOLD}[$1/${TOTAL_STEPS}]${RESET} ${WHITE}$2${RESET}"; echo -e "  ${DIM}$(printf '%.0s─' {1..48})${RESET}"; }

TOTAL_STEPS=4
START_TIME=$(date +%s)

# ── Banner ───────────────────────────────────────────────
clear
echo ""
echo -e "${BLUE}${BOLD}"
cat << 'BANNER'
     ____                      ___                    __
    / __ \___  ____ _____     /   | ____ ____  ____  / /_
   / / / / _ \/ __ `/ __ \   / /| |/ __ `/ _ \/ __ \/ __/
  / /_/ /  __/ /_/ / / / /  / ___ / /_/ /  __/ / / / /_
 /_____/\___/\__,_/_/ /_/  /_/  |_\__, /\___/_/ /_/\__/
                                  /____/
BANNER
echo -e "${RESET}"
echo -e "  ${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "  ${MAGENTA}${BOLD}院长智能体${RESET} ${DIM}|${RESET} Frontend Deploy Script"
echo -e "  ${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "  ${DIM}时间${RESET}   $(date '+%Y-%m-%d %H:%M:%S')"
echo -e "  ${DIM}分支${RESET}   $(git branch --show-current 2>/dev/null || echo 'unknown')"
echo -e "  ${DIM}端口${RESET}   :${APP_PORT}"
echo -e "  ${DIM}节点${RESET}   $(node -v 2>/dev/null || echo 'N/A')"

# ── 1. 拉取最新代码 ─────────────────────────────────────
step 1 "拉取最新代码"
git pull --ff-only && info "代码已更新" || { err "git pull 失败，请检查是否有未提交的更改或冲突"; exit 1; }

COMMITS_PULLED=$(git log HEAD@{1}..HEAD --oneline 2>/dev/null | wc -l | tr -d ' ')
if [ "$COMMITS_PULLED" -gt 0 ] 2>/dev/null; then
  echo -e "  ${DIM}拉取了 ${WHITE}${COMMITS_PULLED}${RESET}${DIM} 个新提交${RESET}"
  git log HEAD@{1}..HEAD --oneline 2>/dev/null | head -5 | while read -r line; do
    echo -e "  ${DIM}  ›${RESET} $line"
  done
fi

# ── 2. 检测依赖是否变化 ─────────────────────────────────
step 2 "检测依赖"
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
  info "安装依赖 (--legacy-peer-deps)..."
  npm install --legacy-peer-deps
  info "依赖安装完成"
else
  info "依赖无变化，跳过安装"
fi

# ── 3. 构建 ─────────────────────────────────────────────
step 3 "构建生产版本"
BUILD_START=$(date +%s)
npm run build || { err "构建失败"; exit 1; }
BUILD_END=$(date +%s)
BUILD_DURATION=$((BUILD_END - BUILD_START))
info "构建完成 ${DIM}(${BUILD_DURATION}s)${RESET}"

# ── 4. 重启服务 ─────────────────────────────────────────
step 4 "重启服务"

OLD_PID=$(ss -tlnp "sport = :$APP_PORT" 2>/dev/null | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | head -1 || true)
if [ -n "$OLD_PID" ]; then
  warn "停止旧进程 (PID: ${OLD_PID})"
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
  info "服务已启动 (PID: ${NEW_PID})"
else
  err "服务启动失败，请检查日志: $LOG_FILE"
  tail -20 "$LOG_FILE" 2>/dev/null
  exit 1
fi

# ── 完成 ─────────────────────────────────────────────────
END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "  ${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "  ${GREEN}${BOLD}Deploy Complete${RESET}  ${DIM}总耗时 ${TOTAL_DURATION}s${RESET}"
echo -e "  ${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "  ${DIM}地址${RESET}   http://43.98.254.243:${APP_PORT}"
echo -e "  ${DIM}进程${RESET}   PID ${NEW_PID}"
echo -e "  ${DIM}日志${RESET}   tail -f ${LOG_FILE}"
echo ""
