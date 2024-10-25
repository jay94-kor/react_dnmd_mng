from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from sqlalchemy.orm import Session

from app.api import deps
from app.crud import crud_po
from app.models import User
from app.schemas import PO, POCreate, POUpdate, POWithDetails
from app.core.utils import save_upload_file

router = APIRouter()

@router.get("/", response_model=List[PO])
def read_pos(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve purchase orders.
    """
    if crud_user.is_admin(current_user):
        pos = crud_po.get_multi(db, skip=skip, limit=limit)
    else:
        pos = crud_po.get_multi_by_owner(
            db=db, owner_id=current_user.id, skip=skip, limit=limit
        )
    return pos

@router.post("/", response_model=PO)
async def create_po(
    *,
    db: Session = Depends(deps.get_db),
    po_in: POCreate = Depends(),
    current_user: User = Depends(deps.get_current_user),
    files: List[UploadFile] = File(...)
) -> Any:
    """
    Create new purchase order.
    """
    # 파일 저장
    file_paths = []
    try:
        for file in files:
            file_path = await save_upload_file(file)
            file_paths.append(file_path)
        
        po = crud_po.create_with_files(
            db=db,
            obj_in=po_in,
            owner_id=current_user.id,
            file_paths=file_paths
        )
        return po
    except Exception as e:
        # 실패 시 업로드된 파일 삭제
        for file_path in file_paths:
            remove_upload_file(file_path)
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{id}", response_model=POWithDetails)
def read_po(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get purchase order by ID.
    """
    po = crud_po.get(db=db, id=id)
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    if not crud_user.is_admin(current_user) and po.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return po

@router.put("/{id}/approve")
def approve_po(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Approve purchase order.
    """
    if not crud_user.is_admin(current_user):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    po = crud_po.approve(db=db, id=id, approved_by=current_user.id)
    return {"message": "Purchase order approved successfully"}
