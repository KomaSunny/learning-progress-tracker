from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # .env が未配置でも /health は動かせるように、必須ではなく None を許容する。
    # DB接続が必要な処理では、app/db/session.py 側で未設定チェックを行う。
    database_url: str | None = None

    # 開発中はSQLログを確認しやすくするため True。
    # 本番環境ではSQLや値がログに出るリスクがあるため False にする。
    db_echo: bool = True 

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    # 設定値はアプリ起動中に基本的に変わらないため、
    # 初回読み込み後は同じ Settings インスタンスを再利用する
    return Settings()