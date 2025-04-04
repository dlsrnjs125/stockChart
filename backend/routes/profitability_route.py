from fastapi import APIRouter, Query, HTTPException
from ..utils.stock_lookup import find_symbol
from ..services.profitability_service import get_profitability_ratios

router = APIRouter()


@router.get("/stock/profitability")
def stock_profitability(query: str = Query(..., description="회사명 또는 종목코드")):
    symbol = find_symbol(query)
    if not symbol:
        raise HTTPException(status_code=404, detail="종목을 찾을 수 없습니다.")

    try:
        return get_profitability_ratios(symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
