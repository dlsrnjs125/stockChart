from fastapi import APIRouter, Query, HTTPException
from ..utils.stock_lookup import find_symbol
from ..services.volatility_service import get_volatility

router = APIRouter()


@router.get("/stock/volatility")
def stock_volatility(query: str = Query(..., description="회사명 또는 종목코드")):
    symbol = find_symbol(query)
    if not symbol:
        raise HTTPException(status_code=404, detail="종목을 찾을 수 없습니다.")

    try:
        return get_volatility(symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
