from pydantic import BaseModel, condecimal
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    contract_amount: condecimal(max_digits=15, decimal_places=2)
    advance_rate: condecimal(max_digits=5, decimal_places=2)
    start_date: datetime
    end_date: datetime
    manager_id: int

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    contract_amount: Optional[condecimal(max_digits=15, decimal_places=2)] = None
    advance_rate: Optional[condecimal(max_digits=5, decimal_places=2)] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    manager_id: Optional[int] = None

class ProjectInDBBase(ProjectBase):
    id: int
    status: str
    created_by_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Project(ProjectInDBBase):
    pass

class ProjectWithDetails(Project):
    purchase_orders: List['PurchaseOrder'] = []
    manager: 'User'
    created_by: 'User'
