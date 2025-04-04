import os
import requests
from dotenv import load_dotenv
from ..core.token_manager import get_access_token

load_dotenv()


def compute_volatility_score(data: dict) -> float:
    try:
        score = 0.0
        score += float(data.get("prdy_vrss_vol_rate", 0)) * 0.4  # 거래량 변동률
        score += abs(float(data.get("prdy_ctrt", 0))) * 0.3  # 등락률
        score += abs(float(data.get("w52_hgpr_vrss_prpr_ctrt", 0))) * 0.2  # 고가 괴리율
        score += float(data.get("vol_tnrt", 0)) * 0.1  # 회전율
        return round(score, 2)
    except Exception as e:
        print("❌ 변동성 스코어 계산 오류:", e)
        return 0.0


def get_volatility(symbol: str) -> dict:
    token = get_access_token()

    url = f"{os.getenv('BASE_URL')}/uapi/domestic-stock/v1/quotations/inquire-price"
    params = {
        "fid_cond_mrkt_div_code": "J",
        "fid_input_iscd": symbol,
    }

    headers = {
        "content-type": "application/json",
        "authorization": f"Bearer {token}",
        "appkey": os.getenv("APP_KEY"),
        "appsecret": os.getenv("APP_SECRET"),
        "tr_id": "FHKST01010100",
        "custtype": "P",
    }

    res = requests.get(url, headers=headers, params=params)
    res_json = res.json()

    if res_json.get("rt_cd") != "0":
        raise Exception(f"API 오류: {res_json}")

    output = res_json.get("output", {})
    volatility_score = compute_volatility_score(output)

    return {
        "symbol": symbol,
        "volatility_score": volatility_score,
        "raw_data": {
            "prdy_ctrt": output.get("prdy_ctrt"),
            "prdy_vrss_vol_rate": output.get("prdy_vrss_vol_rate"),
            "w52_hgpr_vrss_prpr_ctrt": output.get("w52_hgpr_vrss_prpr_ctrt"),
            "vol_tnrt": output.get("vol_tnrt"),
        },
    }
