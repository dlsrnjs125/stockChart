import os
import json
import time
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_CACHE_FILE = os.path.join(BASE_DIR, "token_cache.json")

def load_cached_token():
    if not os.path.exists(TOKEN_CACHE_FILE):
        return None

    with open(TOKEN_CACHE_FILE, "r") as f:
        data = json.load(f)
        if time.time() < data.get("expires_at", 0):
            print("✅ 캐시된 토큰 사용")
            return data["access_token"]
        else:
            print("⏰ 토큰 만료됨")
    return None

def save_token_to_cache(access_token: str, expires_in: int):
    expires_at = time.time() + expires_in - 60
    with open(TOKEN_CACHE_FILE, "w") as f:
        json.dump({
            "access_token": access_token,
            "expires_at": expires_at
        }, f)

def get_access_token():
    cached = load_cached_token()
    if cached:
        return cached

    print("🔐 토큰 발급 요청 중...")
    url = f"{os.getenv('BASE_URL')}/oauth2/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "appkey": os.getenv("APP_KEY"),
        "appsecret": os.getenv("APP_SECRET")
    }

    res = requests.post(url, headers=headers, data=data)
    res_json = res.json()

    print("🔐 토큰 발급 응답:", res_json)

    if "access_token" not in res_json:
        raise Exception(f"토큰 발급 실패: {res_json}")

    access_token = res_json["access_token"]
    expires_in = int(res_json.get("expires_in", 3600))

    save_token_to_cache(access_token, expires_in)
    return access_token
