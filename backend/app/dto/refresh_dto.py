from dataclasses import dataclass
from typing import Optional

@dataclass
class RefreshDTO:
    refresh_token : str
    ip: Optional[str]