# main.py (or auth.py)

import hashlib
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models, schemas

# creates all tables in the database on startup
# if they already exist it skips them
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# # ── Health check ──
# @app.get("/register")
# def root():
#     return {"message": "Backend is running"}

@app.post("/register")
def register():
    return {"ok": True}

# ──────────────────────────────────────────
# AUTH ROUTES
# ──────────────────────────────────────────

def normalize_password(pw: str):
    return hashlib.sha256(pw.encode()).hexdigest()
# REGISTER
# React sends user form data → we save to db → create empty data object
@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    # check passwords match
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # check email not already taken
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # create the user — password stored as plain text for now
    # we will hash it later when we add proper auth
    new_user = models.User(
        first_name           = user.first_name,
        second_name          = user.second_name,
        email                = user.email,
        phone_number         = user.phone_number,
        password             = pwd_context.hash(user.password[:72]),
        role                 = user.role,
        name_of_business     = user.name_of_business,
        nature_of_business   = user.nature_of_business,
        location_of_business = user.location_of_business,
        county               = user.county,
        description          = user.description,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # create empty data object for this user
    # this is what gets filled as they use the app
    user_data = models.UserData(
        userId = new_user.id,
        role   = new_user.role,
    )
    db.add(user_data)
    db.commit()

    return new_user

# LOGIN
# React sends email + password → we verify → send back user + all their data
@app.post("/login", response_model=schemas.LoginResponse)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):

    # find user by email
    user = db.query(models.User).filter(models.User.email == credentials.email).first()

    # check user exists and password matches
    if not user or not pwd_context.verify(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "user":    user,
        "message": "Login successful"
    }

# ──────────────────────────────────────────
# USER DATA ROUTE
# ──────────────────────────────────────────

# GET USER DATA
# fetches everything for the logged in user in one call
@app.get("/userdata/{user_id}", response_model=schemas.UserDataResponse)
def get_user_data(user_id: int, db: Session = Depends(get_db)):

    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()

    if not user_data:
        raise HTTPException(status_code=404, detail="User data not found")

    return user_data

# ──────────────────────────────────────────
# TASKS ROUTES
# ──────────────────────────────────────────

# GET all tasks for a user
@app.get("/tasks/{user_id}", response_model=list[schemas.TaskResponse])
def get_tasks(user_id: int, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data.tasks

# CREATE a task
@app.post("/tasks/{user_id}", response_model=schemas.TaskResponse)
def create_task(user_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
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

# ──────────────────────────────────────────
# MESSAGES ROUTES
# ──────────────────────────────────────────

# GET all messages for a user
@app.get("/messages/{user_id}", response_model=list[schemas.MessageResponse])
def get_messages(user_id: int, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data.messages

# SEND a message
@app.post("/messages/{user_id}", response_model=schemas.MessageResponse)
def send_message(user_id: int, message: schemas.MessageCreate, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    new_message = models.Message(
        userDataId = user_data.id,
        senderId   = message.senderId,
        receiverId = message.receiverId,
        senderName = message.senderName,
        subject    = message.subject,
        body       = message.body,
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

# MARK message as read
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

# GET all communities
@app.get("/communities", response_model=list[schemas.CommunityResponse])
def get_communities(db: Session = Depends(get_db)):
    return db.query(models.Community).all()

# CREATE a community
@app.post("/communities", response_model=schemas.CommunityResponse)
def create_community(community: schemas.CommunityCreate, db: Session = Depends(get_db)):
    new_community = models.Community(
        name        = community.name,
        description = community.description,
        category    = community.category,
        members     = 1,
    )
    db.add(new_community)
    db.commit()
    db.refresh(new_community)
    return new_community

# JOIN a community
@app.post("/communities/{community_id}/join/{user_id}")
def join_community(community_id: int, user_id: int, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
    community = db.query(models.Community).filter(
        models.Community.id == community_id
    ).first()

    if not user_data or not community:
        raise HTTPException(status_code=404, detail="Not found")

    # increment member count
    community.members += 1

    # record the join
    join = models.UserCommunity(
        userDataId  = user_data.id,
        communityId = community_id,
    )
    db.add(join)
    db.commit()
    return {"message": "Joined successfully"}

# ──────────────────────────────────────────
# SALES ROUTES
# ──────────────────────────────────────────

# GET sales by period
@app.get("/sales/{user_id}/{period}", response_model=list[schemas.SaleResponse])
def get_sales(user_id: int, period: str, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return db.query(models.Sale).filter(
        models.Sale.userDataId == user_data.id,
        models.Sale.period     == period
    ).all()

# ADD a sale entry
@app.post("/sales/{user_id}", response_model=schemas.SaleResponse)
def add_sale(user_id: int, sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    new_sale = models.Sale(
        userDataId = user_data.id,
        day        = sale.day,
        orders     = sale.orders,
        completed  = sale.completed,
        pending    = sale.pending,
        period     = sale.period,
    )
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)
    return new_sale

# ──────────────────────────────────────────
# EXPENSES ROUTES
# ──────────────────────────────────────────

# GET expenses by period
@app.get("/expenses/{user_id}/{period}", response_model=list[schemas.ExpenseResponse])
def get_expenses(user_id: int, period: str, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return db.query(models.Expense).filter(
        models.Expense.userDataId == user_data.id,
        models.Expense.period     == period
    ).all()

# ADD an expense entry
@app.post("/expenses/{user_id}", response_model=schemas.ExpenseResponse)
def add_expense(user_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
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
# REVENUE ROUTES
# ──────────────────────────────────────────

# GET revenue by period
@app.get("/revenue/{user_id}/{period}", response_model=list[schemas.RevenueResponse])
def get_revenue(user_id: int, period: str, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return db.query(models.Revenue).filter(
        models.Revenue.userDataId == user_data.id,
        models.Revenue.period     == period
    ).all()

# ADD a revenue entry
@app.post("/revenue/{user_id}", response_model=schemas.RevenueResponse)
def add_revenue(user_id: int, revenue: schemas.RevenueCreate, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(
        models.UserData.userId == user_id
    ).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    new_revenue = models.Revenue(
        userDataId = user_data.id,
        day        = revenue.day,
        revenue    = revenue.revenue,
        profit     = revenue.profit,
        loss       = revenue.loss,
        period     = revenue.period,
    )
    db.add(new_revenue)
    db.commit()
    db.refresh(new_revenue)
    return new_revenue