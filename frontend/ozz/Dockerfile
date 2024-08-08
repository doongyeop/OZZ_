# 1. 빌드 단계
FROM node:20 AS builder

# 2. 작업 디렉터리 설정
WORKDIR /app

# 3. 패키지 파일 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 4. 애플리케이션 소스 복사
COPY . .

# 5. Next.js 애플리케이션 빌드
RUN npm run build

# 6. 런타임 단계
FROM node:20-alpine AS runner

# 7. 작업 디렉터리 설정
WORKDIR /app

# 8. 빌드된 파일 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 9. 환경 변수 설정 (필요 시)
COPY .env /app/.env

# 10. 포트 노출
EXPOSE 3000

# 11. Next.js 애플리케이션 실행
CMD ["npm", "start"]