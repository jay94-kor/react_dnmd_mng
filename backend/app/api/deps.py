from typing import Generator
from sqlalchemy.orm import Session
from app.db.session import SessionLocal

# 데이터베이스 세션을 생성하고 종료하는 종속성
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

