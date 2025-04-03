import os
import requests
from dotenv import load_dotenv
from core.token_manager import get_access_token

load_dotenv()


def get_profitability_ratios(symbol: str) -> dict:
    token = get_access_token()

    url = f"{os.getenv('BASE_URL')}/uapi/domestic-stock/v1/finance/profit-ratio"
    params = {
        "fid_cond_mrkt_div_code": "J",
        "fid_input_iscd": symbol,
        "fid_div_cls_code": "1",  # 연결재무제표
    }

    headers = {
        "content-type": "application/json",
        "authorization": f"Bearer {token}",
        "appkey": os.getenv("APP_KEY"),
        "appsecret": os.getenv("APP_SECRET"),
        "tr_id": "FHKST66430400",
        "custtype": "P",
    }

    response = requests.get(url, headers=headers, params=params)
    res_json = response.json()

    if res_json.get("rt_cd") != "0":
        raise Exception(f"API 오류: {res_json}")

    output = res_json.get("output", [])

    def parse_float(val):
        try:
            return float(str(val).replace(",", "").replace("%", ""))
        except:
            return None

    result = []

    for item in output:
        stac_yymm = item.get("stac_yymm")

        # 실제 필드명 기반 파싱
        roe = parse_float(item.get("self_cptl_ntin_inrt"))  # 자기자본순이익률
        roa = parse_float(item.get("tot_assets_ntin_rate"))  # 총자산순이익률
        operating_margin = parse_float(item.get("sale_totl_rate"))  # 총매출이익률
        net_margin = parse_float(item.get("sale_ntin_rate"))  # 매출순이익률

        result.append(
            {
                "stac_yymm": stac_yymm,
                "roe": roe,
                "roa": roa,
                "operating_margin": operating_margin,
                "net_margin": net_margin,
            }
        )

    return {"symbol": symbol, "ratios": result}
