from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate
from .base import CRUDBase

class CRUDProject(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    # 프로젝트 특화 메서드 구현

crud_project = CRUDProject(Project)
