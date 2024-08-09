from sqlalchemy import Column, Integer, String

from app.core.db.sql_app import Base


class Outfit(Base):
    __tablename__ = "outfits"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer)
    style = Column(String)
    reason = Column(String)
    clothes = Column(String)
