"""Async Redis client wrapper."""

import os

import redis.asyncio as aioredis

REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")

_client: aioredis.Redis | None = None


def _get_client() -> aioredis.Redis:
    global _client
    if _client is None:
        _client = aioredis.from_url(REDIS_URL, decode_responses=True)
    return _client


async def append_cv_request(sub: str, email: str, ts: str, version: str) -> None:
    client = _get_client()
    await client.xadd(
        "cv:requests",
        {"sub": sub, "email": email, "ts": ts, "version": version},
    )
