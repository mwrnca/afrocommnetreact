from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

# ── Base schemas ──
# these are the shared fields, other schemas inherit from them

# ── User schemas ──
class UserBase(BaseModel):
    first_name:           str
    second_name:          str
    email:                str
    phone_number:         str
    role:                 str

    # optional — only business/institution fill these
    name_of_business:     Optional[str] = None
    nature_of_business:   Optional[str] = None
    location_of_business: Optional[str] = None
    county:               Optional[str] = None
    description:          Optional[str] = None

# what React sends when signing up — includes password
class UserCreate(UserBase):
    password:         str
    confirm_password: str

# what the API sends back — never include password in responses
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True  # allows reading from SQLAlchemy models

# ── Login schemas ──
class LoginRequest(BaseModel):
    email:    str
    password: str

class LoginResponse(BaseModel):
    user:    UserResponse
    message: str

# ── Task schemas ──
class TaskBase(BaseModel):
    title:    str
    priority: str
    dueDate:  Optional[str] = None
    notes:    Optional[str] = None

class TaskCreate(TaskBase):
    pass  # same as TaskBase for now

class TaskResponse(TaskBase):
    id:        int
    completed: bool

    class Config:
        from_attributes = True

# ── Message schemas ──
class MessageBase(BaseModel):
    senderId:   int
    receiverId: int
    senderName: str
    subject:    str
    body:       str

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id:        int
    timestamp: datetime.datetime
    read:      bool

    class Config:
        from_attributes = True

# ── Community schemas ──
class CommunityBase(BaseModel):
    name:        str
    description: Optional[str] = None
    category:    Optional[str] = None

class CommunityCreate(CommunityBase):
    pass

class CommunityResponse(CommunityBase):
    id:      int
    members: int

    class Config:
        from_attributes = True

# ── Sales schemas ──
class SaleBase(BaseModel):
    day:       str
    orders:    int
    completed: int
    pending:   int
    period:    str  # weekly, monthly, yearly
    item_name: Optional[str] = None

class SaleCreate(SaleBase):
    pass

class SaleResponse(SaleBase):
    id: int

    class Config:
        from_attributes = True

# ── Expense schemas ──
class ExpenseBase(BaseModel):
    day:      str
    amount:   float
    category: Optional[str] = None
    period:   str

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int

    class Config:
        from_attributes = True

# ── Revenue schemas ──
class RevenueBase(BaseModel):
    day:     str
    revenue: float
    profit:  float
    loss:    float
    period:  str

class RevenueCreate(RevenueBase):
    pass

class RevenueResponse(RevenueBase):
    id: int

    class Config:
        from_attributes = True

# ── UserData schema ──
# what gets sent back when user logs in — full data object
class UserDataResponse(BaseModel):
    id:          int
    userId:      int
    role:        str
    tasks:       List[TaskResponse]       = []
    messages:    List[MessageResponse]    = []
    communities: List[CommunityResponse]  = []
    sales:       List[SaleResponse]       = []
    expenses:    List[ExpenseResponse]    = []
    revenue:     List[RevenueResponse]    = []

    class Config:
        from_attributes = True

# ── Employee schemas ──
class EmployeeBase(BaseModel):
    first_name: str
    last_name:  str
    email:      str
    position:   Optional[str] = None

class EmployeeCreate(EmployeeBase):
    password: str

class EmployeeResponse(EmployeeBase):
    id:         int
    businessId: int
    role:       str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# ── AssignedTask schemas ──
class AssignedTaskBase(BaseModel):
    title:       str
    description: Optional[str] = None
    priority:    Optional[str] = "medium"
    dueDate:     Optional[str] = None

class AssignedTaskCreate(AssignedTaskBase):
    employeeId: int

class AssignedTaskResponse(AssignedTaskBase):
    id:           int
    businessId:   int
    employeeId:   int
    completed:    bool
    created_at:   datetime.datetime
    completed_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

# ── NoticeBoard schemas ──
class NoticeBoardBase(BaseModel):
    title:    str
    body:     str
    postedBy: str

class NoticeBoardCreate(NoticeBoardBase):
    pass

class NoticeBoardResponse(NoticeBoardBase):
    id:         int
    businessId: int
    timestamp:  datetime.datetime

    class Config:
        from_attributes = True

# ── EmployeeLog schemas ──
class EmployeeLogBase(BaseModel):
    entry_type:  str
    title:       str
    amount:      Optional[float] = None
    description: Optional[str]  = None
    client_name: Optional[str]  = None
    status:      str
    date:        str
    notes:       Optional[str]  = None

class EmployeeLogCreate(EmployeeLogBase):
    pass

class EmployeeLogResponse(EmployeeLogBase):
    id:         int
    businessId: int
    employeeId: int
    timestamp:  datetime.datetime

    class Config:
        from_attributes = True

# ── Employee login ──
class EmployeeLoginRequest(BaseModel):
    email:    str
    password: str

class EmployeeLoginResponse(BaseModel):
    employee: EmployeeResponse
    message:  str