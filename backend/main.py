from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os

# ========== DATABASE SETUP (Inline for Vercel) ==========
default_db_path = "/tmp/astrology.db" if os.getenv("VERCEL") else "./astrology.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{default_db_path}")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ========== MODELS ==========
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    dob = Column(String)
    tob = Column(String)
    pob = Column(String)
    gender = Column(String)
    chats = relationship("ChatMessage", back_populates="user")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="chats")

# ========== SCHEMAS ==========
class UserBase(BaseModel):
    name: str
    dob: Optional[str] = None
    tob: Optional[str] = None
    pob: Optional[str] = None
    gender: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class ChatMessageResponse(BaseModel):
    id: int
    user_id: int
    role: str
    content: str
    timestamp: datetime
    class Config:
        from_attributes = True

class ChatRequestDB(BaseModel):
    user_id: int
    message: str

# ========== CREATE TABLES ==========
Base.metadata.create_all(bind=engine)

# ========== APP ==========
app = FastAPI(title="Swastik AI Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== SYSTEM PROMPT ==========
SYSTEM_PROMPT = """You are Swastik AI, an expert Vedic astrologer trained in authentic Jyotish Shastra. Your role is to provide thoughtful, personalized, and ethical astrology guidance.

Speak in a calm, wise, and reassuring tone. Keep your answers clear, structured, and easy to understand.

### Instructions:
* Give insights based on Vedic astrology principles (Rashi, Nakshatra, Lagna, Graha, Dasha, Gochar).
* If full birth details are provided, give personalized analysis.
* If not, give general zodiac-based guidance and mention the limitation.
* Structure answers in:
  1. Overview
  2. Key Insights
  3. Guidance / Remedies

### Restrictions:
* Do NOT predict death or lifespan.
* Do NOT give medical or legal advice.
* Do NOT guarantee outcomes.
* Do NOT create fear or anxiety."""

# ========== BUILT-IN VEDIC AI (Fallback when no vLLM) ==========
def generate_vedic_response(query: str, user_context: str = "") -> str:
    """Smart fallback AI response generator for demo/deployment without vLLM"""
    q = query.lower()
    
    # Safety checks
    if any(w in q for w in ['suicide', 'kill myself', 'end my life']):
        return "🙏 I hear that you are going through a very difficult time, but as an AI astrologer, I cannot offer help with life crises. Please reach out to professional support immediately:\n\n📞 AASRA Helpline: +91-9820466726\n📞 iCall: +91-9152987821\n📞 KIRAN Mental Health Helpline: 1800-599-0019\n\nYou are not alone. Please connect with these services or a loved one."
    
    if any(w in q for w in ['when will i die', 'death date', 'lifespan', 'my death']):
        return "🙏 The sacred scriptures of Jyotish forbid predicting the exact date or time of death and lifespan. I must respectfully decline queries regarding physical longevity. Focus on nurturing your current life path with auspicious actions."
    
    if any(w in q for w in ['cancer', 'disease', 'pregnant', 'medical']):
        return "🙏 Vedic astrology provides guidance on general energy cycles, but for all health, medical diagnoses, and pregnancy timelines, you must consult a certified medical practitioner. I cannot provide diagnostic or physical health predictions."
    
    if any(w in q for w in ['lottery', 'stock market', 'crypto', 'rich overnight']):
        return "🙏 Astrological remedies align inner spiritual energy, but they cannot guarantee financial outcomes, stock market success, or override personal karma. I cannot offer financial guarantees or stock advice."
    
    # Contextual responses
    if any(w in q for w in ['career', 'job', 'work', 'promotion', 'business']):
        return f"""🕉️ **Career & Professional Guidance**

{user_context}

**Overview:** Jupiter's transit through your 10th house (Karma Bhava) indicates a powerful phase for career advancement. The celestial alignments suggest significant professional growth ahead.

**Key Insights:**
• **10th House Activation:** Jupiter's beneficial gaze strengthens your professional standing. Expect recognition from authority figures.
• **Mercury's Support:** Clear communication and analytical thinking are heightened. Ideal for presentations and negotiations.
• **Saturn's Discipline:** Saturn in your 6th house builds resilience against workplace challenges.

**Guidance & Remedies:**
1. 🟠 Perform **Surya Namaskar** at sunrise to strengthen your Sun's influence on career.
2. 🟡 Wear a **Yellow Sapphire (Pukhraj)** on your index finger on Thursday morning.
3. 📿 Chant **"Om Graam Greem Graum Sah Gurave Namah"** 108 times on Thursdays.
4. 🕉️ The period between **12:12 PM – 01:04 PM (Abhijit Muhurta)** is ideal for initiating important career decisions.

*May the cosmic energies guide your professional path toward prosperity. 🙏*"""

    elif any(w in q for w in ['love', 'marriage', 'relationship', 'partner', 'spouse']):
        return f"""🕉️ **Love & Relationship Insights**

{user_context}

**Overview:** Venus, the planet of love and harmony, is currently positioned favorably in your 7th house (Kalatra Bhava). This indicates a deeply transformative period for relationships.

**Key Insights:**
• **Venus in 7th House:** Romantic connections deepen. If single, meaningful encounters are likely through spiritual or educational circles.
• **Moon-Venus Conjunction:** Emotional sensitivity is heightened. Practice patience and empathy in communications.
• **Rahu's Shadow:** Minor misunderstandings may arise due to Rahu's aspect. Clarity in expression resolves these quickly.

**Guidance & Remedies:**
1. 💚 Offer **white flowers** to a Shiva-Parvati temple on Friday evenings.
2. 🌹 Wear **Diamond or Opal** on your middle finger (Shukra finger) for Venus strength.
3. 📿 Chant **"Om Shukraya Namah"** 108 times on Fridays before sunset.
4. 🕊️ Practice **compassionate listening** — the stars indicate resolutions through calm dialogue.

*Let the celestial harmony guide your heart toward its divine counterpart. 🙏*"""

    elif any(w in q for w in ['health', 'fitness', 'energy', 'wellness']):
        return f"""🕉️ **Health & Wellness Analysis**

{user_context}

**Overview:** The Sun's current position strengthens your vital energy (Prana). Mars in your 1st house indicates strong physical constitution, but demands mindful energy management.

**Key Insights:**
• **Sun-Mars Alignment:** High physical energy and stamina. Excellent for starting fitness routines.
• **Moon's Transit:** Emotional health needs attention. Practice grounding exercises during waning moon phases.
• **6th House Activity:** Minor digestive sensitivity possible. Balanced meals with warm spices recommended.

**Guidance & Remedies:**
1. 🌅 Practice **Pranayama (breathing exercises)** during Brahma Muhurta (4:24 AM – 5:12 AM).
2. 🍯 Include **turmeric milk and Ashwagandha** in your evening routine.
3. 📿 Chant **"Om Suryaya Namah"** facing east at sunrise for vitality.
4. 💎 Wear a **Red Coral (Moonga)** ring on your ring finger for Mars strength.

*Note: This is spiritual guidance only. Please consult a medical professional for health concerns. 🙏*"""

    elif any(w in q for w in ['money', 'wealth', 'finance', 'income', 'investment']):
        return f"""🕉️ **Financial & Wealth Prospects**

{user_context}

**Overview:** Your 2nd house (Dhana Bhava) is activated by Jupiter's benefic aspect. The planetary configuration indicates a period of steady financial growth with opportunities for smart accumulation.

**Key Insights:**
• **Jupiter in 2nd House:** Traditional investments and savings yield positive returns. Conservative financial planning is favored.
• **Venus-Mercury Conjunction:** Business acumen is sharpened. Negotiations and deals struck now carry favorable outcomes.
• **Saturn's Discipline:** Long-term financial planning over quick gains is the cosmic advice.

**Guidance & Remedies:**
1. 💛 Donate **yellow lentils (Moong Dal)** to the needy on Thursdays for Jupiter's blessings.
2. 📿 Chant **"Om Shreem Hreem Kleem Maha Lakshmi Namah"** 108 times on Fridays.
3. 🕉️ Keep a **Kuber Yantra** in your financial workspace or safe.
4. 🪙 Avoid major financial commitments during **Rahu Kaal (07:42 AM – 09:20 AM)**.

*May Goddess Lakshmi's grace bring abundance to your financial endeavors. 🙏*"""

    elif any(w in q for w in ['travel', 'trip', 'abroad', 'foreign', 'visa']):
        return f"""🕉️ **Travel & Movement Insights**

{user_context}

**Overview:** The 9th house (Bhagya Bhava) shows positive planetary activity. Rahu's position indicates opportunities for foreign travel or long-distance journeys.

**Key Insights:**
• **9th House Activation:** Long-distance travel is auspicious. Spiritual or educational journeys bring lasting benefits.
• **Rahu in 12th House:** Foreign connections strengthen. Overseas opportunities may materialize.
• **Mercury's Transit:** Short trips and weekend getaways are highly favorable.

**Guidance & Remedies:**
1. 🧳 Start journeys on **Wednesdays or Thursdays** for auspicious beginnings.
2. 📿 Carry a **Hanuman Chalisa** during travel for protection.
3. 🕉️ Chant **"Om Gam Ganapataye Namah"** before starting any journey.
4. ⏰ Avoid starting travel during **Rahu Kaal** for smooth experiences.

*May your journeys be blessed by the divine cosmic winds. 🙏*"""

    elif any(w in q for w in ['education', 'study', 'exam', 'learn', 'knowledge']):
        return f"""🕉️ **Education & Learning Guidance**

{user_context}

**Overview:** Mercury (Budh), the planet of intellect and learning, is strongly positioned in your chart. The 5th house activation indicates enhanced cognitive abilities and academic success.

**Key Insights:**
• **Mercury in Virgo:** Analytical abilities peak. Excellent for research, competitive exams, and skill development.
• **Jupiter's Aspect on 5th House:** Higher education pursuits are strongly supported. Consider advanced studies.
• **Sun's Influence:** Confidence in academic presentations grows. Leadership in educational settings is indicated.

**Guidance & Remedies:**
1. 📚 Study during **Brahma Muhurta (4:24 AM – 5:12 AM)** for maximum retention.
2. 💚 Wear an **Emerald (Panna)** ring on your little finger for Mercury's blessings.
3. 📿 Chant **"Om Budhaya Namah"** 108 times on Wednesdays.
4. 🪷 Offer **Durva grass** to Lord Ganesha before starting exam preparation.

*May Goddess Saraswati illuminate your path of knowledge. 🙏*"""

    else:
        return f"""🕉️ **Cosmic Alignment Reading**

{user_context}

**Overview:** Namaste! The celestial transits today align beautifully for introspection and spiritual growth. Your inner strength (Sun) is currently elevated, creating opportunities for personal transformation.

**Key Planetary Positions:**
• **Jupiter (Guru):** In your Karma Bhava — expansion in purpose and professional clarity.
• **Venus (Shukra):** Favorably placed — harmony in relationships and creative expression.
• **Saturn (Shani):** Teaching patience — long-term stability is being built through current challenges.

**Today's Guidance:**
1. 🌅 Perform **Surya Arghya** (water offering to the Sun) at sunrise for solar alignment.
2. 📿 The mantra **"Om Ghrini Suryaya Namah"** balances your primary transits.
3. 🕉️ **Abhijit Muhurta (12:12 PM – 01:04 PM)** is the most auspicious window for important decisions.
4. ⚠️ Avoid new ventures during **Rahu Kaal (07:42 AM – 09:20 AM)**.

**Spiritual Insight:**
The current Dasha cycle emphasizes inner wisdom over external validation. Trust the cosmic timing — what is meant for you is being aligned by the universe.

*Continue focusing on daily disciplines, and may the stars illuminate your path. 🙏*"""

# ========== API ROUTES ==========
@app.post("/api/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/api/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/api/users/{user_id}/chat", response_model=list[ChatMessageResponse])
def get_chat_history(user_id: int, db: Session = Depends(get_db)):
    return db.query(ChatMessage).filter(ChatMessage.user_id == user_id).all()

@app.post("/api/chat", response_model=ChatMessageResponse)
def chat_endpoint(request: ChatRequestDB, db: Session = Depends(get_db)):
    # 1. Fetch user to build context
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    context_str = f"User Context: Name={user.name}, DOB={user.dob}, Time={user.tob}, Place={user.pob}, Gender={user.gender}"
    
    # 2. Save user message to DB
    user_msg = ChatMessage(user_id=user.id, role="user", content=request.message)
    db.add(user_msg)
    db.commit()
    
    # 3. Try vLLM first, fallback to built-in
    VLLM_BASE_URL = os.getenv("VLLM_BASE_URL", "")
    
    if VLLM_BASE_URL:
        try:
            from openai import OpenAI
            client = OpenAI(base_url=VLLM_BASE_URL, api_key=os.getenv("VLLM_API_KEY", "token-not-needed"))
            
            recent_chats = db.query(ChatMessage).filter(ChatMessage.user_id == user.id).order_by(ChatMessage.id.desc()).limit(5).all()
            recent_chats.reverse()
            
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            for chat in recent_chats[:-1]:
                messages.append({"role": chat.role, "content": chat.content})
            messages.append({"role": "user", "content": f"{context_str}\n\n{request.message}"})
            
            response = client.chat.completions.create(
                model=os.getenv("MODEL_ID", "Qwen/Qwen2.5-7B-Instruct"),
                messages=messages,
                temperature=0.7,
                max_tokens=512
            )
            ai_reply = response.choices[0].message.content
        except Exception as e:
            print(f"vLLM error: {e}")
            ai_reply = generate_vedic_response(request.message, context_str)
    else:
        ai_reply = generate_vedic_response(request.message, context_str)
    
    # 4. Save AI response to DB
    bot_msg = ChatMessage(user_id=user.id, role="assistant", content=ai_reply)
    db.add(bot_msg)
    db.commit()
    db.refresh(bot_msg)
    
    return bot_msg

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Swastik AI Backend"}

# Vercel handler
handler = app
