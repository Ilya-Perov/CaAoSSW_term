from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import create_tables, delete_tables
from streams_router import router as streams_router
from auth_router import router as auth_router
from templates import templates

@asynccontextmanager
async def lifespan(app: FastAPI):
   # await delete_tables()
    #print("База очищена")
    await create_tables()
    print("База готова к работе")
    yield
    print("Выключение")

# Инициализация приложения FastAPI
app = FastAPI(lifespan=lifespan)

# Настройка CORS
origins = [
    "http://176.108.251.220:5173",
    "http://127.0.0.1:5173",
    "http://176.108.251.220:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Подключение маршрутов
app.include_router(streams_router)
app.include_router(auth_router)
