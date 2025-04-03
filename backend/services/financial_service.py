import os
import requests
from dotenv import load_dotenv
from core.token_manager import get_access_token

load_dotenv()


def get_financial_ratios(symbol: str) -> dict:
    token = get_access_token()

    url = f"{os.getenv('BASE_URL')}/uapi/domestic-stock/v1/finance/stability-ratio"
    params = {
        "fid_cond_mrkt_div_code": "J",
        "fid_input_iscd": symbol,
        "fid_div_cls_code": "1",  # 연결 재무제표
    }

    headers = {
        "content-type": "application/json",
        "authorization": f"Bearer {token}",
        "appkey": os.getenv("APP_KEY"),
        "appsecret": os.getenv("APP_SECRET"),
        "tr_id": "FHKST66430600",
        "custtype": "P",
    }

    response = requests.get(url, headers=headers, params=params)
    res_json = response.json()

    if res_json.get("rt_cd") != "0":
        raise Exception(f"API 오류: {res_json}")

    output = res_json.get("output", [])

    def parse_float(val):
        try:
            return float(str(val).replace(",", ""))
        except:
            return None

    def evaluate_status(value: float, thresholds: tuple):
        if value is None:
            return "정보 없음"
        good, warning = thresholds
        if value <= good:
            return "좋음"
        elif value <= warning:
            return "보통"
        else:
            return "위험"

    result = []

    for item in output:
        stac_yymm = item.get("stac_yymm")

        lblt_rate = parse_float(item.get("lblt_rate"))
        bram_depn = parse_float(item.get("bram_depn"))
        crnt_rate = parse_float(item.get("crnt_rate"))
        quck_rate = parse_float(item.get("quck_rate"))

        result.append(
            {
                "stac_yymm": stac_yymm,
                "lblt_rate": lblt_rate,
                "lblt_status": evaluate_status(lblt_rate, (100, 200)),  # 부채비율
                "bram_depn": bram_depn,
                "bram_status": evaluate_status(bram_depn, (50, 100)),  # 고정비율
                "crnt_rate": crnt_rate,
                "crnt_status": evaluate_status(crnt_rate, (150, 100)),  # 유동비율
                "quck_rate": quck_rate,
                "quck_status": evaluate_status(quck_rate, (100, 70)),  # 당좌비율
            }
        )

    return {"symbol": symbol, "ratios": result}  # 분기별 데이터 리스트
