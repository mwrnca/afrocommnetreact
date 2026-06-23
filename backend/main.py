from passlib.context import CryptContext
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models, schemas
from dotenv import load_dotenv
import os
import datetime
import hashlib
import resend

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
resend.api_key = RESEND_API_KEY

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain: str, hashed: str) -> bool:
    return hashlib.sha256(plain.encode()).hexdigest() == hashed

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running"}

# ──────────────────────────────────────────
# AUTH ROUTES
# ──────────────────────────────────────────

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

     # create base user — same for all roles
    new_user = models.User(
        first_name   = user.first_name,
        second_name  = user.second_name,
        email        = user.email,
        phone_number = user.phone_number,
        password     = pwd_context.hash(user.password[:72]),
        role         = user.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # create user data object
    user_data = models.UserData(userId=new_user.id, role=new_user.role)
    db.add(user_data)
    db.commit()

    return new_user

@app.post("/login", response_model=schemas.LoginResponse)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not pwd_context.verify(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"user": user, "message": "Login successful"}

# ──────────────────────────────────────────
# USER DATA ROUTE
# ──────────────────────────────────────────

@app.get("/userdata/{user_id}", response_model=schemas.UserDataResponse)
def get_user_data(user_id: int, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User data not found")
    return user_data

# ──────────────────────────────────────────
# TASKS ROUTES
# ──────────────────────────────────────────

@app.get("/tasks/{user_id}", response_model=list[schemas.TaskResponse])
def get_tasks(user_id: int, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data.tasks

@app.post("/tasks/{user_id}", response_model=schemas.TaskResponse)
def create_task(user_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    new_task = models.Task(
        userDataId = user_data.id,
        title      = task.title,
        priority   = task.priority,
        dueDate    = task.dueDate,
        notes      = task.notes,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.patch("/tasks/{task_id}/complete")
def complete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = True
    db.commit()
    return {"message": "Task completed"}

# ──────────────────────────────────────────
# MESSAGES ROUTES
# ──────────────────────────────────────────

@app.get("/messages/{user_id}/received", response_model=list[schemas.MessageResponse])
def get_received(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Message).filter(
        models.Message.receiverId == user_id
    ).order_by(models.Message.timestamp.desc()).all()

@app.get("/messages/{user_id}/sent", response_model=list[schemas.MessageResponse])
def get_sent(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Message).filter(
        models.Message.senderId == user_id
    ).order_by(models.Message.timestamp.desc()).all()

@app.get("/messages/{user_id}", response_model=list[schemas.MessageResponse])
def get_messages(user_id: int, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data.messages

@app.post("/messages/{user_id}", response_model=schemas.MessageResponse)
def send_message(user_id: int, message: schemas.MessageCreate, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    new_message = models.Message(
        userDataId = user_data.id,
        senderId   = message.senderId,
        receiverId = message.receiverId,
        senderName = message.senderName,
        receiverName = message.receiverName,
        subject    = message.subject,
        body       = message.body,
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@app.patch("/messages/{message_id}/read")
def mark_read(message_id: int, db: Session = Depends(get_db)):
    message = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    message.read = True
    db.commit()
    return {"message": "Marked as read"}

# ──────────────────────────────────────────
# COMMUNITIES ROUTES
# ──────────────────────────────────────────

@app.get("/communities/user/{user_id}", response_model=list[schemas.CommunityResponse])
def get_user_communities(user_id: int, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    joined = db.query(models.UserCommunity).filter(
        models.UserCommunity.userDataId == user_data.id
    ).all()
    community_ids = [j.communityId for j in joined]
    return db.query(models.Community).filter(
        models.Community.id.in_(community_ids)
    ).all()

@app.get("/communities", response_model=list[schemas.CommunityResponse])
def get_communities(role: str = None, category: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Community)
    if role:     query = query.filter(models.Community.role == role)
    if category: query = query.filter(models.Community.category == category)
    return query.all()

@app.post("/communities", response_model=schemas.CommunityResponse)
def create_community(community: schemas.CommunityCreate, db: Session = Depends(get_db)):
    new_community = models.Community(
        name        = community.name,
        description = community.description,
        category    = community.category,
        members     = 1,
        role        = community.role,
    )
    db.add(new_community)
    db.commit()
    db.refresh(new_community)
    return new_community

#── Community join check — prevent duplicate joins ──
@app.post("/communities/{community_id}/join/{user_id}")
def join_community(community_id: int, user_id: int, password: str = None, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    community = db.query(models.Community).filter(models.Community.id == community_id).first()
    if not user_data or not community:
        raise HTTPException(status_code=404, detail="Not found")

    # check if already joined
    existing = db.query(models.UserCommunity).filter(
        models.UserCommunity.userDataId == user_data.id,
        models.UserCommunity.communityId == community_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already a member")

    # check password if community is private
    if community.is_private:
        if not password or password != community.password:
            raise HTTPException(status_code=403, detail="Incorrect password")

    community.members += 1
    join = models.UserCommunity(userDataId=user_data.id, communityId=community_id)
    db.add(join)
    db.commit()
    return {"message": "Joined successfully"}

@app.get("/community-posts/{community_id}", response_model=list[schemas.CommunityPostResponse])
def get_community_posts(community_id: int, db: Session = Depends(get_db)):
    return db.query(models.CommunityPost).filter(
        models.CommunityPost.communityId == community_id
    ).order_by(models.CommunityPost.timestamp.asc()).all()

@app.post("/community-posts/{community_id}", response_model=schemas.CommunityPostResponse)
def create_community_post(community_id: int, post: schemas.CommunityPostCreate, db: Session = Depends(get_db)):
    new_post = models.CommunityPost(
        communityId = community_id,
        userId      = post.userId,
        senderName  = post.senderName,
        body        = post.body,
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

# ──────────────────────────────────────────
# SALES ROUTES
# ──────────────────────────────────────────

@app.get("/sales/{user_id}/{period}", response_model=list[schemas.SaleResponse])
def get_sales(user_id: int, period: str, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(models.Sale).filter(
        models.Sale.userDataId == user_data.id,
        models.Sale.period     == period
    ).all()

@app.post("/sales/{user_id}", response_model=schemas.SaleResponse)
def add_sale(user_id: int, sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    new_sale = models.Sale(
        userDataId = user_data.id,
        day        = sale.day,
        orders     = sale.orders,
        completed  = sale.completed,
        pending    = sale.pending,
        period     = sale.period,
        item_name  = sale.item_name,
    )
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)
    return new_sale

# ──────────────────────────────────────────
# EXPENSES ROUTES
# ──────────────────────────────────────────

@app.get("/expenses/{user_id}/{period}", response_model=list[schemas.ExpenseResponse])
def get_expenses(user_id: int, period: str, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(models.Expense).filter(
        models.Expense.userDataId == user_data.id,
        models.Expense.period     == period
    ).all()

@app.post("/expenses/{user_id}", response_model=schemas.ExpenseResponse)
def add_expense(user_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.userId == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    new_expense = models.Expense(
        userDataId = user_data.id,
        day        = expense.day,
        amount     = expense.amount,
        category   = expense.category,
        period     = expense.period,
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

# ──────────────────────────────────────────
# DIRECTORY ROUTE
# ──────────────────────────────────────────

@app.get("/directory", response_model=list[schemas.UserResponse])
def get_directory(role: str = None, county: str = None, search: str = None, db: Session = Depends(get_db)):
    query = db.query(models.User).filter(models.User.role != "consumer")
    if role:
        query = query.filter(models.User.role == role)
    if county:
        query = query.filter(models.User.county == county)
    if search:
        query = query.filter(
            models.User.first_name.ilike(f"%{search}%") |
            models.User.name_of_business.ilike(f"%{search}%") |
            models.User.nature_of_business.ilike(f"%{search}%")
        )
    return query.all()

# ──────────────────────────────────────────
# USER SEARCH ROUTE
# ──────────────────────────────────────────

@app.get("/users/search", response_model=list[schemas.UserResponse])
def search_users(name: str, db: Session = Depends(get_db)):
    return db.query(models.User).filter(
        (models.User.first_name.ilike(f"%{name}%")) |
        (models.User.second_name.ilike(f"%{name}%")) 
    ).all()

# ──────────────────────────────────────────
# EMPLOYEE ROUTES
# ──────────────────────────────────────────

@app.post("/employees/{business_id}", response_model=schemas.EmployeeResponse)
def create_employee(business_id: int, employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    business = db.query(models.User).filter(models.User.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    existing = db.query(models.Employee).filter(models.Employee.email == employee.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_employee = models.Employee(
        businessId = business_id,
        first_name = employee.first_name,
        last_name  = employee.last_name,
        email      = employee.email,
        password   = hash_password(employee.password),
        position   = employee.position,
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    try:
        resend.Emails.send({
            "from":    f"{business.name_of_business} <onboarding@resend.dev>",
            "to":      employee.email,
            "subject": f"Your Employee Account — {business.name_of_business}",
            "html":    f"""
                <h2>Welcome to {business.name_of_business}</h2>
                <p>Hi {employee.first_name},</p>
                <p>You have been added as an employee at <strong>{business.name_of_business}</strong>.</p>
                <p>Your login details:</p>
                <ul>
                    <li><strong>Email:</strong> {employee.email}</li>
                    <li><strong>Password:</strong> {employee.password}</li>
                </ul>
                <p>Login at: <a href="http://localhost:5173/login/employee">Click here to login</a></p>
            """
        })
    except Exception as e:
        print(f"Email failed: {e}")
    return new_employee

@app.get("/employees/{business_id}", response_model=list[schemas.EmployeeResponse])
def get_employees(business_id: int, db: Session = Depends(get_db)):
    return db.query(models.Employee).filter(models.Employee.businessId == business_id).all()

@app.get("/employee/{employee_id}", response_model=schemas.EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@app.post("/login/employee", response_model=schemas.EmployeeLoginResponse)
def employee_login(credentials: schemas.EmployeeLoginRequest, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.email == credentials.email).first()
    if not employee or not verify_password(credentials.password, employee.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"employee": employee, "message": "Login successful"}

# ──────────────────────────────────────────
# ASSIGNED TASKS ROUTES
# ──────────────────────────────────────────

@app.get("/assigned-tasks/employee/{employee_id}", response_model=list[schemas.AssignedTaskResponse])
def get_employee_tasks(employee_id: int, db: Session = Depends(get_db)):
    return db.query(models.AssignedTask).filter(
        models.AssignedTask.employeeId == employee_id
    ).all()

@app.get("/assigned-tasks/{business_id}", response_model=list[schemas.AssignedTaskResponse])
def get_assigned_tasks(business_id: int, db: Session = Depends(get_db)):
    return db.query(models.AssignedTask).filter(
        models.AssignedTask.businessId == business_id
    ).all()

@app.post("/assigned-tasks/{business_id}", response_model=schemas.AssignedTaskResponse)
def create_assigned_task(business_id: int, task: schemas.AssignedTaskCreate, db: Session = Depends(get_db)):
    new_task = models.AssignedTask(
        businessId  = business_id,
        employeeId  = task.employeeId,
        title       = task.title,
        description = task.description,
        priority    = task.priority,
        dueDate     = task.dueDate,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.patch("/assigned-tasks/{task_id}/complete")
def complete_assigned_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.AssignedTask).filter(models.AssignedTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed    = True
    task.completed_at = datetime.datetime.utcnow()
    db.commit()
    return {"message": "Task completed"}

# ──────────────────────────────────────────
# NOTICE BOARD ROUTES
# ──────────────────────────────────────────

@app.post("/notice-board/{business_id}", response_model=schemas.NoticeBoardResponse)
def post_notice(business_id: int, notice: schemas.NoticeBoardCreate, db: Session = Depends(get_db)):
    new_notice = models.NoticeBoard(
        businessId = business_id,
        title      = notice.title,
        body       = notice.body,
        postedBy   = notice.postedBy,
    )
    db.add(new_notice)
    db.commit()
    db.refresh(new_notice)
    return new_notice

@app.get("/notice-board/{business_id}", response_model=list[schemas.NoticeBoardResponse])
def get_notices(business_id: int, db: Session = Depends(get_db)):
    return db.query(models.NoticeBoard).filter(
        models.NoticeBoard.businessId == business_id
    ).order_by(models.NoticeBoard.timestamp.desc()).all()

# ──────────────────────────────────────────
# EMPLOYEE LOG ROUTES
# ──────────────────────────────────────────

@app.post("/logs/{employee_id}", response_model=schemas.EmployeeLogResponse)
def create_log(employee_id: int, log: schemas.EmployeeLogCreate, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    new_log = models.EmployeeLog(
        businessId  = employee.businessId,
        employeeId  = employee_id,
        entry_type  = log.entry_type,
        title       = log.title,
        amount      = log.amount,
        description = log.description,
        client_name = log.client_name,
        status      = log.status,
        date        = log.date,
        notes       = log.notes,
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@app.get("/logs/business/{business_id}", response_model=list[schemas.EmployeeLogResponse])
def get_business_logs(business_id: int, db: Session = Depends(get_db)):
    return db.query(models.EmployeeLog).filter(
        models.EmployeeLog.businessId == business_id
    ).order_by(models.EmployeeLog.timestamp.desc()).all()

@app.get("/logs/employee/{employee_id}", response_model=list[schemas.EmployeeLogResponse])
def get_employee_logs(employee_id: int, db: Session = Depends(get_db)):
    return db.query(models.EmployeeLog).filter(
        models.EmployeeLog.employeeId == employee_id
    ).order_by(models.EmployeeLog.timestamp.desc()).all()

# ── Profile routes ──
# called after register to save role-specific info

@app.post("/profiles/business/{user_id}", response_model=schemas.BusinessProfileResponse)
def create_business_profile(user_id: int, profile: schemas.BusinessProfileCreate, db: Session = Depends(get_db)):
    new_profile = models.BusinessProfile(
        userId               = user_id,
        name_of_business     = profile.name_of_business,
        nature_of_business   = profile.nature_of_business,
        location_of_business = profile.location_of_business,
        county               = profile.county,
        description          = profile.description,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@app.post("/profiles/institution/{user_id}", response_model=schemas.InstitutionProfileResponse)
def create_institution_profile(user_id: int, profile: schemas.InstitutionProfileCreate, db: Session = Depends(get_db)):
    new_profile = models.InstitutionProfile(
        userId              = user_id,
        name_of_institution = profile.name_of_institution,
        type_of_institution = profile.type_of_institution,
        location            = profile.location,
        county              = profile.county,
        description         = profile.description,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@app.post("/profiles/professional/{user_id}", response_model=schemas.ProfessionalProfileResponse)
def create_professional_profile(user_id: int, profile: schemas.ProfessionalProfileCreate, db: Session = Depends(get_db)):
    new_profile = models.ProfessionalProfile(
        userId         = user_id,
        profession     = profile.profession,
        specialization = profile.specialization,
        location       = profile.location,
        county         = profile.county,
        description    = profile.description,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@app.get("/profiles/business/{user_id}", response_model=schemas.BusinessProfileResponse)
def get_business_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.BusinessProfile).filter(
        models.BusinessProfile.userId == user_id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.get("/profiles/institution/{user_id}", response_model=schemas.InstitutionProfileResponse)
def get_institution_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.InstitutionProfile).filter(
        models.InstitutionProfile.userId == user_id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.get("/profiles/professional/{user_id}", response_model=schemas.ProfessionalProfileResponse)
def get_professional_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.ProfessionalProfile).filter(
        models.ProfessionalProfile.userId == user_id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

# ── Profile GET routes already exist — add an UPDATE route ──

@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, updates: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if updates.first_name:   user.first_name   = updates.first_name
    if updates.second_name:  user.second_name  = updates.second_name
    if updates.email:        user.email        = updates.email
    if updates.phone_number: user.phone_number = updates.phone_number
    db.commit()
    db.refresh(user)
    return user

@app.put("/profiles/business/{user_id}", response_model=schemas.BusinessProfileResponse)
def update_business_profile(user_id: int, updates: schemas.BusinessProfileCreate, db: Session = Depends(get_db)):
    profile = db.query(models.BusinessProfile).filter(models.BusinessProfile.userId == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.name_of_business     = updates.name_of_business
    profile.nature_of_business   = updates.nature_of_business
    profile.location_of_business = updates.location_of_business
    profile.county                = updates.county
    profile.description           = updates.description
    db.commit()
    db.refresh(profile)
    return profile

# ── Reply route — sends a reply linked to the original conversation ──
# this just reuses /messages/{user_id} POST, no new route needed
# the fix is on the frontend — explained below

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_single_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/messages/{user_id}/conversation/{other_id}", response_model=list[schemas.MessageResponse])
def get_conversation(user_id: int, other_id: int, db: Session = Depends(get_db)):
    return db.query(models.Message).filter(
        (
            (models.Message.senderId == user_id) & (models.Message.receiverId == other_id) & (models.Message.deleted_by_sender == False)
        ) | (
            (models.Message.senderId == other_id) & (models.Message.receiverId == user_id) & (models.Message.deleted_by_receiver == False)
        )
    ).order_by(models.Message.timestamp.asc()).all()

# main.py — add these routes

# POST to public channel — only verified accounts allowed
@app.post("/public-posts/{user_id}", response_model=schemas.PublicPostResponse)
def create_public_post(user_id: int, post: schemas.PublicPostCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Only verified accounts can post here")

    new_post = models.PublicPost(
        userId     = user_id,
        senderName = user.first_name,
        role       = user.role,
        body       = post.body,
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

# GET public posts — no auth needed, this is for the landing page
@app.get("/public-posts", response_model=list[schemas.PublicPostResponse])
def get_public_posts(db: Session = Depends(get_db)):
    return db.query(models.PublicPost).filter(
        models.PublicPost.deleted == False
    ).order_by(models.PublicPost.timestamp.desc()).limit(20).all()

# main.py — add this route
@app.get("/directory/full", response_model=list[schemas.DirectoryEntryResponse])
def get_directory_full(role: str = None, county: str = None, search: str = None, db: Session = Depends(get_db)):
    query = db.query(models.User).filter(models.User.role != "consumer")
    if role:
        query = query.filter(models.User.role == role)
    if search:
        query = query.filter(
            models.User.first_name.ilike(f"%{search}%") |
            models.User.second_name.ilike(f"%{search}%")
        )

    users = query.all()
    results = []

    for user in users:
        entry = {
            "id": user.id,
            "first_name": user.first_name,
            "second_name": user.second_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "role": user.role,
            "name": None,
            "category": None,
            "location": None,
            "county": None,
            "description": None,
        }

        if user.role == "business" and user.business_profile:
            p = user.business_profile
            entry.update({
                "name": p.name_of_business,
                "category": p.nature_of_business,
                "location": p.location_of_business,
                "county": p.county,
                "description": p.description,
            })
        elif user.role == "institution" and user.institution_profile:
            p = user.institution_profile
            entry.update({
                "name": p.name_of_institution,
                "category": p.type_of_institution,
                "location": p.location,
                "county": p.county,
                "description": p.description,
            })
        elif user.role == "professional" and user.professional_profile:
            p = user.professional_profile
            entry.update({
                "name": f"{user.first_name} {user.second_name}",
                "category": p.profession,
                "location": p.location,
                "county": p.county,
                "description": p.description,
            })

        # apply county filter after merging since it's on the profile not the user
        if county and entry["county"] != county:
            continue

        results.append(entry)

    return results

@app.put("/profiles/institution/{user_id}", response_model=schemas.InstitutionProfileResponse)
def update_institution_profile(user_id: int, updates: schemas.InstitutionProfileCreate, db: Session = Depends(get_db)):
    profile = db.query(models.InstitutionProfile).filter(models.InstitutionProfile.userId == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.name_of_institution = updates.name_of_institution
    profile.type_of_institution  = updates.type_of_institution
    profile.location             = updates.location
    profile.county               = updates.county
    profile.description          = updates.description
    db.commit()
    db.refresh(profile)
    return profile

@app.put("/profiles/professional/{user_id}", response_model=schemas.ProfessionalProfileResponse)
def update_professional_profile(user_id: int, updates: schemas.ProfessionalProfileCreate, db: Session = Depends(get_db)):
    profile = db.query(models.ProfessionalProfile).filter(models.ProfessionalProfile.userId == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile.profession     = updates.profession
    profile.specialization = updates.specialization
    profile.location        = updates.location
    profile.county          = updates.county
    profile.description     = updates.description
    db.commit()
    db.refresh(profile)
    return profile