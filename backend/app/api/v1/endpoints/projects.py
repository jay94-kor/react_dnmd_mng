from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api import deps
from app.crud import crud_project
from app.models import User
from app.schemas import Project, ProjectCreate, ProjectUpdate, ProjectWithDetails

router = APIRouter()

@router.get("/", response_model=List[Project])
def read_projects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve projects.
    """
    if crud_user.is_admin(current_user):
        projects = crud_project.get_multi(db, skip=skip, limit=limit)
    else:
        projects = crud_project.get_multi_by_owner(
            db=db, owner_id=current_user.id, skip=skip, limit=limit
        )
    return projects

@router.post("/", response_model=Project)
def create_project(
    *,
    db: Session = Depends(deps.get_db),
    project_in: ProjectCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new project.
    """
    project = crud_project.create_with_owner(
        db=db, obj_in=project_in, owner_id=current_user.id
    )
    return project

@router.get("/{id}", response_model=ProjectWithDetails)
def read_project(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get project by ID.
    """
    project = crud_project.get(db=db, id=id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not crud_user.is_admin(current_user) and project.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return project

@router.put("/{id}", response_model=Project)
def update_project(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    project_in: ProjectUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update project.
    """
    project = crud_project.get(db=db, id=id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not crud_user.is_admin(current_user) and project.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    project = crud_project.update(db=db, db_obj=project, obj_in=project_in)
    return project