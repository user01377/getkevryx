# the file that contains the routes for the api, endpoints are logic are defined here

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.models import *
from app.schema import ProductListResponse

router = APIRouter()

@router.get("/db-health")
def db_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e)
            }
        )
    
@router.get("/products", response_model=ProductListResponse)
def get_products(db: Session = Depends(get_db)):

    products = (
        db.query(Product)
        .order_by(Product.id.asc())
        .all()
    )

    return ProductListResponse(
        data=products,
        count=len(products)
    )