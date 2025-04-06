from fastapi import APIRouter, Query, HTTPException
from ..utils.stock_lookup import find_symbol
from ..services.supply_service import get_stock_summary, score_supply_demand

router = APIRouter()


@router.get("/stock/supply-risk")
def stock_supply_risk(query: str = Query(..., description="회사명 또는 종목코드")):
    """
    종목의 수급 관련 지표를 기반으로 리스크 점수를 반환합니다.
    """
    symbol = find_symbol(query)
    if not symbol:
        raise HTTPException(status_code=404, detail="종목을 찾을 수 없습니다.")

    try:
        summary = get_stock_summary(symbol)
        score_result = score_supply_demand(summary)

        return {
            "symbol": symbol,
            "risk_score": score_result["total_score"],
            "risk_level": score_result["risk_level"],
            "score_details": score_result["score_by_metric"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
