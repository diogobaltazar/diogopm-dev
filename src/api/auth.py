"""JWKS-cached JWT validation against Auth0."""

import os
import time

import httpx
from jose import jwt as jose_jwt, JWTError

from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

AUTH0_DOMAIN = os.environ.get("AUTH0_DOMAIN", "")
AUTH0_AUDIENCE = os.environ.get("AUTH0_AUDIENCE", "")

_jwks_cache: dict | None = None
_jwks_cache_time: float = 0.0
_JWKS_TTL = 600  # 10 minutes — short enough to pick up key rotations quickly

_security = HTTPBearer(auto_error=False)


async def _get_jwks() -> dict:
    global _jwks_cache, _jwks_cache_time
    now = time.time()
    if _jwks_cache and (now - _jwks_cache_time) < _JWKS_TTL:
        return _jwks_cache
    url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url)
        r.raise_for_status()
        _jwks_cache = r.json()
        _jwks_cache_time = now
        return _jwks_cache


async def require_user(
    credentials: HTTPAuthorizationCredentials | None = Security(_security),
) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization required")
    token = credentials.credentials
    try:
        header = jose_jwt.get_unverified_header(token)
        jwks = await _get_jwks()
        key = next(
            (k for k in jwks.get("keys", []) if k.get("kid") == header.get("kid")),
            None,
        )
        if not key:
            raise HTTPException(status_code=401, detail="Unknown signing key")
        payload: dict = jose_jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=AUTH0_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/",
        )
        return payload
    except JWTError as exc:
        raise HTTPException(status_code=401, detail=f"Invalid token: {exc}") from exc
