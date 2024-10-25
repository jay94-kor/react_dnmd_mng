from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import datetime

class POBase(BaseModel):
    project_id: int
    supplier_name: str
    amount: condecimal(max_digits=15, decimal_places=2)
    po_number: str

class POCreate(POBase):
    pass

class POUpdate(BaseModel):
    supplier_name: Optional[str] = None
    amount: Optional[condecimal(max_digits=15, decimal_places=2)] = None
    status: Optional[str] = None

class POInDBBase(POBase):
    id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PO(POInDBBase):
    pass

class POWithDetails(PO):
    project: 'Project'
