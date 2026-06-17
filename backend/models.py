from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id           = Column(Integer, primary_key=True, index=True)
    first_name   = Column(String, nullable=False)
    second_name  = Column(String, nullable=False)
    email        = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=False)
    password     = Column(String, nullable=False)
    role         = Column(String, nullable=False)

    user_data            = relationship("UserData",            back_populates="user", uselist=False)
    business_profile     = relationship("BusinessProfile",     back_populates="user", uselist=False)
    institution_profile  = relationship("InstitutionProfile",  back_populates="user", uselist=False)
    professional_profile = relationship("ProfessionalProfile", back_populates="user", uselist=False)
    consumer_profile     = relationship("ConsumerProfile",     back_populates="user", uselist=False)

class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id                   = Column(Integer, primary_key=True, index=True)
    userId               = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    name_of_business     = Column(String, nullable=False)
    nature_of_business   = Column(String, nullable=False)
    location_of_business = Column(String, nullable=False)
    county               = Column(String, nullable=False)
    description          = Column(Text,   nullable=True)

    user = relationship("User", back_populates="business_profile")

class InstitutionProfile(Base):
    __tablename__ = "institution_profiles"

    id                  = Column(Integer, primary_key=True, index=True)
    userId              = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    name_of_institution = Column(String, nullable=False)
    type_of_institution = Column(String, nullable=False)
    location            = Column(String, nullable=False)
    county              = Column(String, nullable=False)
    description         = Column(Text,   nullable=True)

    user = relationship("User", back_populates="institution_profile")

class ProfessionalProfile(Base):
    __tablename__ = "professional_profiles"

    id             = Column(Integer, primary_key=True, index=True)
    userId         = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    profession     = Column(String, nullable=False)
    specialization = Column(String, nullable=True)
    location       = Column(String, nullable=False)
    county         = Column(String, nullable=False)
    description    = Column(Text,   nullable=True)

    user = relationship("User", back_populates="professional_profile")

class ConsumerProfile(Base):
    __tablename__ = "consumer_profiles"

    id     = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    user = relationship("User", back_populates="consumer_profile")

class UserData(Base):
    __tablename__ = "user_data"

    id     = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    role   = Column(String, nullable=False)

    user        = relationship("User",          back_populates="user_data")
    tasks       = relationship("Task",          back_populates="user_data")
    messages    = relationship("Message",       back_populates="user_data")
    communities = relationship("UserCommunity", back_populates="user_data")
    sales       = relationship("Sale",          back_populates="user_data")
    expenses    = relationship("Expense",       back_populates="user_data")

class Task(Base):
    __tablename__ = "tasks"

    id         = Column(Integer, primary_key=True, index=True)
    userDataId = Column(Integer, ForeignKey("user_data.id"), nullable=False)
    title      = Column(String, nullable=False)
    priority   = Column(String, nullable=False)
    dueDate    = Column(String, nullable=True)
    notes      = Column(Text,   nullable=True)
    completed  = Column(Boolean, default=False)

    user_data = relationship("UserData", back_populates="tasks")

class Message(Base):
    __tablename__ = "messages"

    id                  = Column(Integer, primary_key=True, index=True)
    userDataId          = Column(Integer, ForeignKey("user_data.id"), nullable=False)
    senderId            = Column(Integer, nullable=False)
    receiverId          = Column(Integer, nullable=False)
    senderName          = Column(String, nullable=False)
    receiverName        = Column(String, nullable=True)
    subject             = Column(String, nullable=False)
    body                = Column(Text,   nullable=False)
    timestamp           = Column(DateTime, default=datetime.datetime.utcnow)
    read                = Column(Boolean, default=False)
    deleted_by_sender   = Column(Boolean, default=False)
    deleted_by_receiver = Column(Boolean, default=False)

    user_data   = relationship("UserData",   back_populates="messages")
    attachments = relationship("Attachment", back_populates="message")

class Attachment(Base):
    __tablename__ = "attachments"

    id              = Column(Integer, primary_key=True, index=True)
    messageId       = Column(Integer, ForeignKey("messages.id"),        nullable=True)
    communityPostId = Column(Integer, ForeignKey("community_posts.id"), nullable=True)
    name            = Column(String, nullable=False)
    file_type       = Column(String, nullable=False)
    data            = Column(Text,   nullable=True)
    url             = Column(String, nullable=True)
    timestamp       = Column(DateTime, default=datetime.datetime.utcnow)

    message        = relationship("Message",       back_populates="attachments")
    community_post = relationship("CommunityPost", back_populates="attachments")

class Community(Base):
    __tablename__ = "communities"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, nullable=False)
    description = Column(Text,   nullable=True)
    category    = Column(String, nullable=True)
    members     = Column(Integer, default=1)
    role        = Column(String, nullable=True)
    is_private  = Column(Boolean, default=False)  # ← add this
    password    = Column(String, nullable=True)   # ← add this

    members_list = relationship("UserCommunity", back_populates="community")
    posts        = relationship("CommunityPost", back_populates="community")

class UserCommunity(Base):
    __tablename__ = "user_communities"

    id          = Column(Integer, primary_key=True, index=True)
    userDataId  = Column(Integer, ForeignKey("user_data.id"),   nullable=False)
    communityId = Column(Integer, ForeignKey("communities.id"), nullable=False)

    user_data = relationship("UserData",  back_populates="communities")
    community = relationship("Community", back_populates="members_list")

class CommunityPost(Base):
    __tablename__ = "community_posts"

    id          = Column(Integer, primary_key=True, index=True)
    communityId = Column(Integer, ForeignKey("communities.id"), nullable=False)
    userId      = Column(Integer, nullable=False)
    senderName  = Column(String, nullable=False)
    body        = Column(Text,   nullable=False)
    timestamp   = Column(DateTime, default=datetime.datetime.utcnow)
    deleted     = Column(Boolean, default=False)

    community   = relationship("Community",  back_populates="posts")
    attachments = relationship("Attachment", back_populates="community_post")

class Sale(Base):
    __tablename__ = "sales"

    id         = Column(Integer, primary_key=True, index=True)
    userDataId = Column(Integer, ForeignKey("user_data.id"), nullable=False)
    day        = Column(String,  nullable=False)
    orders     = Column(Integer, default=0)
    completed  = Column(Integer, default=0)
    pending    = Column(Integer, default=0)
    period     = Column(String,  nullable=False)
    item_name  = Column(String,  nullable=True)

    user_data = relationship("UserData", back_populates="sales")

class Expense(Base):
    __tablename__ = "expenses"

    id         = Column(Integer, primary_key=True, index=True)
    userDataId = Column(Integer, ForeignKey("user_data.id"), nullable=False)
    day        = Column(String, nullable=False)
    amount     = Column(Float,  default=0)
    category   = Column(String, nullable=True)
    period     = Column(String, nullable=False)

    user_data = relationship("UserData", back_populates="expenses")

class Employee(Base):
    __tablename__ = "employees"

    id         = Column(Integer, primary_key=True, index=True)
    businessId = Column(Integer, ForeignKey("users.id"), nullable=False)
    first_name = Column(String, nullable=False)
    last_name  = Column(String, nullable=False)
    email      = Column(String, unique=True, nullable=False)
    password   = Column(String, nullable=False)
    position   = Column(String, nullable=True)
    role       = Column(String, default="employee")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    business       = relationship("User",         foreign_keys=[businessId])
    assigned_tasks = relationship("AssignedTask", back_populates="employee")
    logs           = relationship("EmployeeLog",  back_populates="employee")

class AssignedTask(Base):
    __tablename__ = "assigned_tasks"

    id           = Column(Integer, primary_key=True, index=True)
    businessId   = Column(Integer, ForeignKey("users.id"),     nullable=False)
    employeeId   = Column(Integer, ForeignKey("employees.id"), nullable=False)
    title        = Column(String, nullable=False)
    description  = Column(Text,   nullable=True)
    priority     = Column(String, default="medium")
    dueDate      = Column(String, nullable=True)
    completed    = Column(Boolean, default=False)
    created_at   = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    employee = relationship("Employee", back_populates="assigned_tasks")

class NoticeBoard(Base):
    __tablename__ = "notice_board"

    id         = Column(Integer, primary_key=True, index=True)
    businessId = Column(Integer, ForeignKey("users.id"), nullable=False)
    title      = Column(String, nullable=False)
    body       = Column(Text,   nullable=False)
    postedBy   = Column(String, nullable=False)
    timestamp  = Column(DateTime, default=datetime.datetime.utcnow)

class EmployeeLog(Base):
    __tablename__ = "employee_logs"

    id          = Column(Integer, primary_key=True, index=True)
    businessId  = Column(Integer, ForeignKey("users.id"),      nullable=False)
    employeeId  = Column(Integer, ForeignKey("employees.id"),  nullable=False)
    entry_type  = Column(String, nullable=False)
    title       = Column(String, nullable=False)
    amount      = Column(Float,  nullable=True)
    description = Column(Text,   nullable=True)
    client_name = Column(String, nullable=True)
    status      = Column(String, nullable=False)
    date        = Column(String, nullable=False)
    notes       = Column(Text,   nullable=True)
    timestamp   = Column(DateTime, default=datetime.datetime.utcnow)

    employee = relationship("Employee", back_populates="logs")