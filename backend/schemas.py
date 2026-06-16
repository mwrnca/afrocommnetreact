from pydantic import BaseModel
from typing import Optional, List
import datetime

# ── User schemas ──
class UserBase(BaseModel):
    first_name:  str
    second_name: str
    email:       str
    phone_number: str
    role:        str

class UserCreate(UserBase):
    password:         str
    confirm_password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# ── Profile schemas ──
class BusinessProfileBase(BaseModel):
    name_of_business:     str
    nature_of_business:   str
    location_of_business: str
    county:               str
    description:          Optional[str] = None

class BusinessProfileCreate(BusinessProfileBase):
    pass

class BusinessProfileResponse(BusinessProfileBase):
    id:     int
    userId: int

    class Config:
        from_attributes = True

class InstitutionProfileBase(BaseModel):
    name_of_institution: str
    type_of_institution: str
    location:            str
    county:              str
    description:         Optional[str] = None

class InstitutionProfileCreate(InstitutionProfileBase):
    pass

class InstitutionProfileResponse(InstitutionProfileBase):
    id:     int
    userId: int

    class Config:
        from_attributes = True

class ProfessionalProfileBase(BaseModel):
    profession:     str
    specialization: Optional[str] = None
    location:       str
    county:         str
    description:    Optional[str] = None

class ProfessionalProfileCreate(ProfessionalProfileBase):
    pass

class ProfessionalProfileResponse(ProfessionalProfileBase):
    id:     int
    userId: int

    class Config:
        from_attributes = True

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
    pass

class TaskResponse(TaskBase):
    id:        int
    completed: bool

    class Config:
        from_attributes = True

# ── Attachment schemas ──
class AttachmentBase(BaseModel):
    name:      str
    file_type: str
    data:      Optional[str] = None
    url:       Optional[str] = None

class AttachmentCreate(AttachmentBase):
    messageId:       Optional[int] = None
    communityPostId: Optional[int] = None

class AttachmentResponse(AttachmentBase):
    id:              int
    messageId:       Optional[int] = None
    communityPostId: Optional[int] = None
    timestamp:       datetime.datetime

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
    id:                  int
    timestamp:           datetime.datetime
    read:                bool
    deleted_by_sender:   bool = False
    deleted_by_receiver: bool = False
    attachments:         List[AttachmentResponse] = []

    class Config:
        from_attributes = True

# ── Community schemas ──
class CommunityBase(BaseModel):
    name:        str
    description: Optional[str] = None
    category:    Optional[str] = None
    role:        Optional[str] = None

class CommunityCreate(CommunityBase):
    pass

class CommunityResponse(CommunityBase):
    id:      int
    members: int

    class Config:
        from_attributes = True

# ── CommunityPost schemas ──
class CommunityPostBase(BaseModel):
    body:       str
    senderName: str
    userId:     int

class CommunityPostCreate(CommunityPostBase):
    pass

class CommunityPostResponse(CommunityPostBase):
    id:          int
    communityId: int
    timestamp:   datetime.datetime
    deleted:     bool = False
    attachments: List[AttachmentResponse] = []

    class Config:
        from_attributes = True

# ── Sales schemas ──
class SaleBase(BaseModel):
    day:       str
    orders:    int
    completed: int
    pending:   int
    period:    str
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

# ── UserData schema ──
class UserDataResponse(BaseModel):
    id:          int
    userId:      int
    role:        str
    tasks:       List[TaskResponse]      = []
    messages:    List[MessageResponse]   = []
    communities: List[CommunityResponse] = []
    sales:       List[SaleResponse]      = []
    expenses:    List[ExpenseResponse]   = []

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