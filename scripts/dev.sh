#!/bin/bash
# 개발 서버 실행 스크립트

# 프론트엔드 실행
cd frontend && pnpm dev &

# 백엔드 실행
cd backend && poetry run uvicorn main:app --reload --port 8000 &

# 모든 백그라운드 프로세스가 종료될 때까지 대기
wait
