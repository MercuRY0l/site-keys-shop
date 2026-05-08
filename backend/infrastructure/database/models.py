


from sqlalchemy import Column, Integer, String, Float, DateTime, func, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class UserModel(Base):
    __tablename__ = "Users"
    
    id = Column("ID", Integer, primary_key=True, autoincrement=True)
    username = Column("Username", String(50), unique=True, nullable=False)
    password = Column("Password", String(255), nullable=False)
    email = Column("Email", String(255), unique=True, nullable=False)
    created_at = Column("created_at", DateTime(timezone=True), server_default=func.sysdatetime())

class AuthTokensModel(Base):
    __tablename__ = "AuthTokens"
    
    id = Column("ID", Integer, primary_key=True, autoincrement=True)
    user_id = Column("user_id", Integer, ForeignKey("Users.ID", ondelete = "CASCADE"), nullable=False)
    refresh_token = Column(String(512), nullable=False, unique = True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("UserModel", backref="auth_tokens")
     
    def __repr__(self):
        return f"<AuthToken(user_id={self.user_id}, expires_at={self.expires_at})>"


class BlackListTokensModel(Base):
    __tablename__ = "BlackListTokens"
    
    id = Column("ID",Integer, primary_key=True, autoincrement=True)
    token = Column(String(512), nullable=False)
    token_type = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey("Users.ID", ondelete="SET NULL"))
    reason = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    
    user = relationship("UserModel", backref="blacklist_tokens")
    
    def __repr__(self):
        return f"<BlacklistedToken(user_id={self.user_id}, type={self.token_type})>"
 

class Log(Base):
    
    __tablename__ = "UsersLog"
    __table_args__ = {"schema": "dbo"}
    
    id = Column("ID", Integer, primary_key=True, autoincrement=True)
    event_type = Column("event_type", String(255), nullable=False)
    username = Column("username", String(255))
    user_id = Column("user_id", Integer)
    status = Column("status", String(255), nullable=False)
    ip = Column("ip", String(255))
    reason = Column("reason", String(255), nullable=False)
    time = Column("time", DateTime(timezone=True), server_default=func.sysdatetime())
    


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_category = Column(String(255), index=True, nullable=False)
    product_name = Column(String(255), index=True, nullable=False)
    product_description = Column(String(512), nullable=False)
    product_price = Column(Float, nullable=False)
    product_imageUrl = Column(String)

class Cart(Base):
    __tablename__ = "carts"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

class Cart_Items(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True)
    cart_id = Column(Integer, ForeignKey("carts.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)