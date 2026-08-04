from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    dob: Optional[str] = None
    tob: Optional[str] = None
    pob: Optional[str] = None
    gender: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class ChatMessageBase(BaseModel):
    role: str
    content: str

class ChatMessageCreate(ChatMessageBase):
    user_id: int

class ChatMessage(ChatMessageBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class ChatRequestDB(BaseModel):
    user_id: int
    message: str
