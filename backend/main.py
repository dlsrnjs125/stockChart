from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .chart_service import get_chart_data

app = FastAPI()

# 프론트엔드에서 요청 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/chart/{timeframe}")
def fetch_chart(symbol: str, timeframe: str = "daily"):
    """
    종목코드(symbol)와 차트 종류(timeframe): daily/weekly/monthly/yearly
    """
    return get_chart_data(symbol, timeframe)
