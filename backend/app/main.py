import os
import logging
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routes import router
from redis.asyncio import ConnectionPool, Redis
from pyrate_limiter import RedisBucket, Rate, Duration, Limiter
from app.startup import startup_backend


def create_app(enable_lifespan: bool = True):
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        if enable_lifespan:
            startup_backend()

            rates = [Rate(60, Duration.MINUTE), Rate(5, Duration.SECOND)]
            redis = Redis(
                connection_pool=ConnectionPool.from_url(
                    f"redis://:{os.getenv('REDIS_PASSWORD')}@{os.getenv('REDIS_HOST')}:{os.getenv('REDIS_PORT')}"
                )
            )

            for i in range(1, 6):
                try:
                    logging.info("Connecting to redis..")
                    await redis.ping()
                    logging.info("Redis connected.")
                    break
                except Exception:
                    logging.error(
                        "Redis connection error, retrying in %s seconds", i * 2
                    )
                    await asyncio.sleep(i**2)
            else:
                raise RuntimeError("Redis connection failed.")

            bucket = await RedisBucket.init(rates, redis, "kevryx-rate-limit")

            app.state.redis = redis
            app.state.limiter = Limiter(bucket)

        yield

        if enable_lifespan:
            await app.state.redis.aclose()

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
