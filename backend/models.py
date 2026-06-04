from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

# ── Users table ──
# stores all user types — role field determines which dashboard they see
class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    first_name    = Column(String, nullable=False)
    second_name   = Column(String, nullable=False)
    email         = Column(String, unique=True, index=True, nullable=False)
    phone_number  = Column(String, nullable=False)
    password      = Column(String, nullable=False)  # will be hashed later
    role          = Column(String, nullable=False)  # business, consumer, institution, professional

    # business specific fields — nullable so other roles dont need them
    name_of_business     = Column(String, nullable=True)
    nature_of_business   = Column(String, nullable=True)
    location_of_business = Column(String, nullable=True)
    county               = Column(String, nullable=True)
    description          = Column(Text, nullable=True)

    # relationship — one user has one data object
    user_data = relationship("UserData", back_populates="user", uselist=False)

# ── UserData table ──
# created at signup — holds all the user's app data
# one row per user, referenced by userId everywhere
class UserData(Base):
    __tablename__ = "user_data"

    id      = Column(Integer, primary_key=True, index=True)
    userId  = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    role    = Column(String, nullable=False)

    # relationship back to user
    user = relationship("User", back_populates="user_data")

    # relationships to other tables
    tasks       = relationship("Task",      back_populates="user_data")
    messages    = relationship("Message",   back_populates="user_data")
    communities = relationship("UserCommunity", back_populates="user_data")
    sales       = relationship("Sale",      back_populates="user_data")
    expenses    = relationship("Expense",   back_populates="user_data")
    revenue     = relationship("Revenue",   back_populates="user_data")

# ── Tasks table ──
class Task(Base):
    __tablename__ = "tasks"

    id          = Column(Integer, primary_key=True, index=True)
    userDataId  = Column(Integer, ForeignKey("user_data.id"), nullable=False)
    title       = Column(String, nullable=False)
    priority    = Column(String, nullable=False)  # high, medium, low
    dueDate     = Column(String, nullable=True)
    notes       = Column(Text, nullable=True)
    completed   = Column(Boolean, default=False)

    user_data = relationship("UserData", back_populates="tasks")

# ── Messages table ──
class Message(Base):
    __tablename__ = "messages"

    id           = Column(Integer, primary_key=True, index=True)
    userDataId   = Column(Integer, ForeignKey("user_data.id"), nullable=False)
    senderId     = Column(Integer, nullable=False)
    receiverId   = Column(Integer, nullable=False)
    senderName   = Column(String, nullable=False)
    subject      = Column(String, nullable=False)
    body         = Column(Text, nullable=False)
    timestamp    = Column(DateTime, default=datetime.datetime.utcnow)
    read         = Column(Boolean, default=False)

    user_data = relationship("UserData", back_populates="messages")

# ── Communities table ──
# the actual community
class Community(Base):
    __tablename__ = "communities"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category    = Column(String, nullable=True)
    members     = Column(Integer, default=1)

    # which users have joined this community
    members_list = relationship("UserCommunity", back_populates="community")

# ── UserCommunity table ──
# junction table — tracks which users joined which communities
class UserCommunity(Base):
    __tablename__ = "user_communities"

    id          = Column(Integer, primary_key=True, index=True)
    userDataId  = Column(Integer, ForeignKey("user_data.id"), nullable=False)
    communityId = Column(Integer, ForeignKey("communities.id"), nullable=False)

    user_data  = relationship("UserData",  back_populates="communities")
    community  = relationship("Community", back_populates="members_list")

# ── Sales table ──
class Sale(Base):
    __tablename__ = "sales"

    id         = Column(Integer, primary_key=True, index=True)
    userDataId = Column(Integer, ForeignKey("user_data.id"), nullable=False)
    day        = Column(String, nullable=False)   # Mon, Tue etc
    orders     = Column(Integer, default=0)
    completed  = Column(Integer, default=0)
    pending    = Column(Integer, default=0)
    period     = Column(String, nullable=False)   # weekly, monthly, yearly

    user_data = relationship("UserData", back_populates="sales")

# ── Expenses table ──
class Expense(Base):
    __tablename__ = "expenses"

    id         = Column(Integer, primary_key=True, index=True)
    userDataId = Column(Integer, ForeignKey("user_data.id"), nullable=False)
    day        = Column(String, nullable=False)
    amount     = Column(Float, default=0)
    category   = Column(String, nullable=True)
    period     = Column(String, nullable=False)   # weekly, monthly, yearly

    user_data = relationship("UserData", back_populates="expenses")

# ── Revenue table ──
class Revenue(Base):
    __tablename__ = "revenues"

    id         = Column(Integer, primary_key=True, index=True)
    userDataId = Column(Integer, ForeignKey("user_data.id"), nullable=False)
    day        = Column(String, nullable=False)
    revenue    = Column(Float, default=0)
    profit     = Column(Float, default=0)
    loss       = Column(Float, default=0)
    period     = Column(String, nullable=False)

    user_data = relationship("UserData", back_populates="revenue")