from fastapi import FastAPI
import time
from contextlib import asynccontextmanager
from routes import router
from database import Base, engine
import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    yield

    # add shutdown logic here


app = FastAPI(lifespan=lifespan)

app.include_router(router)