# 우분투 환경 설정 가이드

이 문서는 LinkPitch MVP 프로젝트를 우분투(WSL) 환경에서 개발하기 위한 설정 가이드입니다.

## 📋 목차

1. [필수 사전 요구사항](#필수-사전-요구사항)
2. [Node.js 및 nvm 설정](#nodejs-및-nvm-설정)
3. [프로젝트 설정](#프로젝트-설정)
4. [환경 변수 설정](#환경-변수-설정)
5. [환경 검증](#환경-검증)
6. [문제 해결](#문제-해결)

---

## 필수 사전 요구사항

### 1. 우분투/WSL 확인

```bash
# 우분투 버전 확인
lsb_release -a

# WSL 버전 확인 (WSL 사용 시)
wsl --version
```

### 2. 기본 패키지 업데이트

```bash
sudo apt update
sudo apt upgrade -y
```

---

## Node.js 및 nvm 설정

### 1. nvm 설치 (Node Version Manager)

nvm이 설치되어 있지 않다면:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

설치 후 터미널을 다시 열거나:

```bash
source ~/.bashrc
```

### 2. Node.js 20 설치 및 기본 버전 설정

```bash
# nvm 로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Node.js 20 설치
nvm install 20

# 기본 버전으로 설정
nvm alias default 20

# 사용 중인 버전 확인
nvm use 20
node --version
# v20.19.5 (또는 유사한 버전)이 나와야 합니다
```

### 3. .bashrc 자동 설정

프로젝트 디렉토리로 이동 시 자동으로 Node.js 20을 사용하도록 설정:

```bash
# .bashrc에 다음이 이미 추가되어 있어야 합니다:
# - nvm 자동 로드
# - nvm use default
# - PATH 우선순위 설정

# .bashrc 확인
tail -10 ~/.bashrc

# 만약 nvm 관련 설정이 없다면:
cat >> ~/.bashrc << 'EOF'

# Use nvm default version and prioritize nvm node path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use default >/dev/null 2>&1
export PATH="/home/$USER/.nvm/versions/node/$(nvm version default)/bin:$PATH"
EOF

# .bashrc 다시 로드
source ~/.bashrc
```

### 4. 새 터미널에서 확인

**중요**: 새 터미널을 열고 다음을 확인하세요:

```bash
node --version
# v20.19.5가 나와야 합니다

which node
# /home/your-username/.nvm/versions/node/v20.19.5/bin/node 가 나와야 합니다
```

---

## 프로젝트 설정

### 1. 프로젝트 디렉토리로 이동

```bash
cd ~/projects/LinkPitch-MVP-project/LinkPitch-MVP-project-main
```

### 2. .nvmrc 파일 확인

프로젝트 루트에 `.nvmrc` 파일이 있어야 합니다:

```bash
cat .nvmrc
# 20 이 출력되어야 합니다
```

프로젝트 디렉토리로 이동하면 자동으로 Node.js 20이 사용됩니다.

### 3. pnpm 설치

```bash
# pnpm이 설치되어 있지 않다면
npm install -g pnpm

# 버전 확인
pnpm --version
```

### 4. 프로젝트 의존성 설치

```bash
pnpm install
```

---

## 환경 변수 설정

### 1. .env.local 파일 생성

```bash
cp .env.example .env.local
```

### 2. 환경 변수 설정

`.env.local` 파일을 열어 다음 변수들을 설정하세요:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Storage
NEXT_PUBLIC_STORAGE_BUCKET=app-assets

# n8n Webhook (선택사항)
N8N_WEBHOOK_URL=your_n8n_webhook_url

# OpenAI API (선택사항)
OPENAI_API_KEY=your_openai_api_key
```

자세한 내용은 [AGENTS.md](../AGENTS.md#environment-variables)를 참고하세요.

---

## 환경 검증

프로젝트 루트에서 환경 검증 스크립트를 실행하세요:

```bash
bash scripts/check-environment.sh
```

이 스크립트는 다음을 확인합니다:
- ✅ Node.js 버전 (20 이상)
- ✅ nvm 설치 및 설정
- ✅ .nvmrc 파일
- ✅ pnpm 설치
- ✅ 환경 변수 설정
- ✅ PATH 설정
- ✅ 프로젝트 의존성

---

## 문제 해결

### 문제 1: 새 터미널에서 Node.js 18이 사용됨

**증상**: `node --version`이 `v18.19.1`을 반환

**해결 방법**:

```bash
# 1. nvm이 제대로 로드되는지 확인
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20
node --version

# 2. .bashrc 확인
grep -n "nvm" ~/.bashrc

# 3. .bashrc 다시 로드
source ~/.bashrc

# 4. 새 터미널에서 테스트
```

### 문제 2: PATH에 nvm 경로가 없음

**증상**: `which node`가 `/usr/bin/node`를 반환

**해결 방법**:

```bash
# .bashrc 끝에 다음 추가
cat >> ~/.bashrc << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use default >/dev/null 2>&1
export PATH="/home/$USER/.nvm/versions/node/$(nvm version default)/bin:$PATH"
EOF

source ~/.bashrc
```

### 문제 3: Supabase 경고 메시지

**증상**: `Node.js 18 and below are deprecated` 경고

**해결 방법**: Node.js 20 이상을 사용하면 해결됩니다. 위의 설정을 따라하세요.

### 문제 4: pnpm 명령어를 찾을 수 없음

**해결 방법**:

```bash
# pnpm 재설치
npm install -g pnpm

# PATH 확인
echo $PATH | tr ':' '\n' | grep npm

# 전역 npm 경로 확인
npm config get prefix
```

---

## 개발 워크플로우

### 일일 개발 시작 시

```bash
# 1. 프로젝트 디렉토리로 이동
cd ~/projects/LinkPitch-MVP-project/LinkPitch-MVP-project-main

# 2. 환경 확인 (선택사항)
bash scripts/check-environment.sh

# 3. 개발 서버 시작
pnpm dev
```

### 새 기능 개발 전

```bash
# 1. 최신 코드 가져오기
git pull

# 2. 의존성 업데이트 (필요시)
pnpm install

# 3. 환경 검증
bash scripts/check-environment.sh
```

---

## 추가 리소스

- [AGENTS.md](../AGENTS.md): 프로젝트 전체 가이드
- [DEV_GUIDE.md](./DEV_GUIDE.md): 개발 가이드
- [PRD.md](./PRD.md): 제품 요구사항 문서

---

## 참고사항

- **항상 우분투 터미널에서 직접 작업하세요**: PowerShell을 통한 WSL 실행은 환경 변수 문제를 일으킬 수 있습니다.
- **새 터미널을 열 때마다 환경을 확인하세요**: `node --version`으로 Node.js 20이 사용되는지 확인
- **문제가 발생하면 환경 검증 스크립트를 실행하세요**: `bash scripts/check-environment.sh`

