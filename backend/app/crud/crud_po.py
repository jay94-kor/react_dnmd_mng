from app.models.project import PurchaseOrder
from app.schemas.po import POCreate, POUpdate
from .base import CRUDBase

class CRUDPO(CRUDBase[PurchaseOrder, POCreate, POUpdate]):
    # 구매 주문서 특화 메서드 구현

crud_po = CRUDPO(PurchaseOrder)
