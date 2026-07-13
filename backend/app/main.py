import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routes import router
from app.startup import startup_backend, shutdown_scheduler


def create_app(enable_lifespan: bool = True):
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        if enable_lifespan:
            startup_backend()

        yield

        if enable_lifespan:
            shutdown_scheduler()

    app = FastAPI(lifespan=lifespan)

    origins = os.getenv("CORS_ORIGINS", "")
    origins = origins.split(",") if origins else []

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router, prefix="/api")

    return app


app = create_app()
