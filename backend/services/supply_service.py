import os
import requests
from ..core.token_manager import get_access_token
from dotenv import load_dotenv

load_dotenv()


def score_supply_demand(data: dict) -> dict:
    def score_foreign_ratio(val):
        val = float(val)
        if val >= 50:
            return 30
        elif val >= 40:
            return 25
        elif val >= 30:
            return 20
        elif val >= 20:
            return 10
        else:
            return 5

    def score_net_buy(qty):
        qty = int(qty)
        if qty > 1_000_000:
            return 25
        elif qty > 0:
            return 20
        elif qty > -500_000:
            return 10
        else:
            return 0

    def score_turnover(turnover):
        turnover = float(turnover)
        if 0.1 <= turnover <= 2.0:
            return 20
        elif turnover <= 5.0:
            return 10
        else:
            return 5

    # 개별 점수 계산
    score1 = score_foreign_ratio(data.get("hts_frgn_ehrt", 0))
    score2 = score_net_buy(data.get("frgn_ntby_qty", 0))
    score3 = score_net_buy(data.get("pgtr_ntby_qty", 0))
    score4 = score_turnover(data.get("vol_tnrt", 0.15))

    total_score = score1 + score2 + score3 + score4

    return {
        "score_by_metric": [
            {"label": "외국인 지분율", "score": score1, "max": 30},
            {"label": "외국인 순매수", "score": score2, "max": 25},
            {"label": "기관 순매수", "score": score3, "max": 25},
            {"label": "회전율(유동성)", "score": score4, "max": 20},
        ],
        "total_score": total_score,
        "risk_level": (
            "낮음" if total_score >= 80 else "보통" if total_score >= 50 else "높음"
        ),
    }


def get_stock_summary(symbol: str) -> dict:
    def safe_int(value) -> int:
        try:
            return int(
                str(value)
                .replace(",", "")
                .replace(" ", "")
                .replace("억", "")
                .replace("조", "")
            )
        except:
            return 0

    def safe_float(value) -> float:
        try:
            return float(str(value).replace(",", "").replace("%", ""))
        except:
            return 0.0

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

    response = requests.get(url, headers=headers, params=params)
    res_json = response.json()

    if res_json.get("rt_cd") != "0":
        raise Exception(f"API 오류: {res_json}")

    output = res_json.get("output", {})

    return {
        "symbol": symbol,
        "price": safe_int(output.get("stck_prpr")),
        "change": safe_int(output.get("prdy_vrss")),
        "change_rate": safe_float(output.get("prdy_ctrt")),
        "open": safe_int(output.get("stck_oprc")),
        "high": safe_int(output.get("stck_hgpr")),
        "low": safe_int(output.get("stck_lwpr")),
        "previous_close": safe_int(output.get("stck_sdpr")),
        "volume": safe_int(output.get("acml_vol")),
        "trade_amount": safe_int(output.get("acml_tr_pbmn")),
        # 수급 점수화용 필드
        "hts_frgn_ehrt": safe_float(output.get("hts_frgn_ehrt")),
        "frgn_ntby_qty": safe_int(output.get("frgn_ntby_qty")),
        "pgtr_ntby_qty": safe_int(output.get("pgtr_ntby_qty")),
        "vol_tnrt": safe_float(output.get("vol_tnrt")),
    }
