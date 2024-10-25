from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    status = Column(String, nullable=False, default="active")
    
    # Financial information
    contract_amount = Column(Numeric(15, 2), nullable=False)
    advance_rate = Column(Numeric(5, 2), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    
    # Relations
    created_by_id = Column(Integer, ForeignKey("users.id"))
    manager_id = Column(Integer, ForeignKey("users.id"))
    
    created_by = relationship("User", foreign_keys=[created_by_id])
    manager = relationship("User", foreign_keys=[manager_id])
    purchase_orders = relationship("PurchaseOrder", back_populates="project")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    po_number = Column(String, unique=True, index=True)
    supplier_name = Column(String, nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    status = Column(String, nullable=False, default="pending")
    
    project = relationship("Project", back_populates="purchase_orders")