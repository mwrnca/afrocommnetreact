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
    role        = Column(String, nullable=True)  # ← add this

    members_list = relationship("UserCommunity", back_populates="community")
    posts        = relationship("CommunityPost", back_populates="community")

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
    item_name  = Column(String, nullable=True)

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

# ── Employee table ──
class Employee(Base):
    __tablename__ = "employees"

    id          = Column(Integer, primary_key=True, index=True)
    businessId  = Column(Integer, ForeignKey("users.id"), nullable=False)
    first_name  = Column(String, nullable=False)
    last_name   = Column(String, nullable=False)
    email       = Column(String, unique=True, nullable=False)
    password    = Column(String, nullable=False)
    position    = Column(String, nullable=True)
    role        = Column(String, default="employee")
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)

    # relationships
    business        = relationship("User", foreign_keys=[businessId])
    assigned_tasks  = relationship("AssignedTask", back_populates="employee")
    logs            = relationship("EmployeeLog", back_populates="employee")

# ── AssignedTask table ──
class AssignedTask(Base):
    __tablename__ = "assigned_tasks"

    id          = Column(Integer, primary_key=True, index=True)
    businessId  = Column(Integer, ForeignKey("users.id"), nullable=False)
    employeeId  = Column(Integer, ForeignKey("employees.id"), nullable=False)
    title       = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority    = Column(String, default="medium")
    dueDate     = Column(String, nullable=True)
    completed   = Column(Boolean, default=False)
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    employee = relationship("Employee", back_populates="assigned_tasks")

# ── NoticeBoard table ──
class NoticeBoard(Base):
    __tablename__ = "notice_board"

    id          = Column(Integer, primary_key=True, index=True)
    businessId  = Column(Integer, ForeignKey("users.id"), nullable=False)
    title       = Column(String, nullable=False)
    body        = Column(Text, nullable=False)
    postedBy    = Column(String, nullable=False)
    timestamp   = Column(DateTime, default=datetime.datetime.utcnow)

# ── EmployeeLog table ──
# general log form entries from employee home
class EmployeeLog(Base):
    __tablename__ = "employee_logs"

    id          = Column(Integer, primary_key=True, index=True)
    businessId  = Column(Integer, ForeignKey("users.id"), nullable=False)
    employeeId  = Column(Integer, ForeignKey("employees.id"), nullable=False)
    entry_type  = Column(String, nullable=False)  # Sale, New Client, Service etc
    title       = Column(String, nullable=False)
    amount      = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    client_name = Column(String, nullable=True)
    status      = Column(String, nullable=False)  # Completed, Pending, Follow-up
    date        = Column(String, nullable=False)
    notes       = Column(Text, nullable=True)
    timestamp   = Column(DateTime, default=datetime.datetime.utcnow)

    employee = relationship("Employee", back_populates="logs")

class CommunityPost(Base):
    __tablename__ = "community_posts"

    id          = Column(Integer, primary_key=True, index=True)
    communityId = Column(Integer, ForeignKey("communities.id"), nullable=False)
    userId      = Column(Integer, nullable=False)
    senderName  = Column(String, nullable=False)
    body        = Column(Text, nullable=False)
    timestamp   = Column(DateTime, default=datetime.datetime.utcnow)

    community = relationship("Community", back_populates="posts")