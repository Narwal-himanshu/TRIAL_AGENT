import os
import json
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from app.common.gemini import generate
from app.db.database import SessionLocal
from app.db.models import CareerTemplate

persist_directory = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_db")

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


def initialize_vector_db():
    db = SessionLocal()
    existing = db.query(CareerTemplate).count()
    if existing > 0:
        db.close()
        return
    templates = _seed_default_templates()
    for t in templates:
        db.add(t)
    db.commit()
    db.close()

    texts = [f"{t.title}: {t.description}" for t in templates]
    metadatas = [{"level": t.level.value, "title": t.title} for t in templates]
    Chroma.from_texts(
        texts=texts,
        embedding=embeddings,
        metadatas=metadatas,
        persist_directory=persist_directory,
    )


def _seed_default_templates():
    return [
        CareerTemplate(
            title="Software Engineer",
            description="Build and maintain software systems. Focus on data structures, algorithms, system design, and clean code practices.",
            level="beginner",
            milestones=[{"name": "Master DSA Basics", "timeline_months": 3}, {"name": "Build 3 Projects", "timeline_months": 4}, {"name": "Learn System Design", "timeline_months": 3}, {"name": "Internship Prep", "timeline_months": 2}],
            skills_to_learn=["Data Structures & Algorithms", "OOP", "Git", "REST APIs", "SQL"],
            recommended_roles=["Junior Software Engineer", "SDE-1", "Backend Developer"],
            timeline_months=12,
            required_skills=["python", "java", "cpp"],
        ),
        CareerTemplate(
            title="Data Scientist",
            description="Analyze data to drive decisions. Master statistics, machine learning, and data visualization.",
            level="intermediate",
            milestones=[{"name": "Statistics & Probability", "timeline_months": 2}, {"name": "ML Algorithms", "timeline_months": 3}, {"name": "Deep Learning", "timeline_months": 3}, {"name": "Kaggle Projects", "timeline_months": 4}],
            skills_to_learn=["Python", "Statistics", "Machine Learning", "TensorFlow/PyTorch", "SQL"],
            recommended_roles=["Data Scientist", "ML Engineer", "Analytics Engineer"],
            timeline_months=12,
            required_skills=["python", "sql", "statistics"],
        ),
        CareerTemplate(
            title="AI/ML Engineer",
            description="Design and deploy machine learning models. Focus on deep learning, NLP, computer vision, and MLOps.",
            level="advanced",
            milestones=[{"name": "Advanced ML", "timeline_months": 3}, {"name": "Deep Learning Specialization", "timeline_months": 3}, {"name": "MLOps", "timeline_months": 3}, {"name": "Capstone Project", "timeline_months": 3}],
            skills_to_learn=["Deep Learning", "NLP", "Computer Vision", "MLOps", "CUDA"],
            recommended_roles=["AI Engineer", "ML Engineer", "Research Engineer"],
            timeline_months=12,
            required_skills=["python", "deep-learning", "mlops"],
        ),
        CareerTemplate(
            title="Cybersecurity Analyst",
            description="Protect systems and networks. Learn ethical hacking, network security, and incident response.",
            level="beginner",
            milestones=[{"name": "Networking Basics", "timeline_months": 2}, {"name": "Security Fundamentals", "timeline_months": 3}, {"name": "CTF Practice", "timeline_months": 3}, {"name": "Certification Prep", "timeline_months": 4}],
            skills_to_learn=["Network Security", "Ethical Hacking", "Cryptography", "Incident Response", "Compliance"],
            recommended_roles=["Security Analyst", "SOC Analyst", "Penetration Tester"],
            timeline_months=12,
            required_skills=["networking", "linux", "security"],
        ),
        CareerTemplate(
            title="DevOps Engineer",
            description="Bridge development and operations. Master CI/CD, cloud platforms, containerization, and infrastructure as code.",
            level="intermediate",
            milestones=[{"name": "Linux & Scripting", "timeline_months": 2}, {"name": "Containerization", "timeline_months": 2}, {"name": "CI/CD Pipelines", "timeline_months": 3}, {"name": "Cloud Certification", "timeline_months": 5}],
            skills_to_learn=["Docker", "Kubernetes", "AWS/GCP", "Terraform", "CI/CD"],
            recommended_roles=["DevOps Engineer", "Platform Engineer", "Cloud Engineer"],
            timeline_months=12,
            required_skills=["linux", "docker", "cloud"],
        ),
        CareerTemplate(
            title="Full Stack Developer",
            description="Build web applications end-to-end. Master frontend frameworks, backend APIs, databases, and deployment.",
            level="beginner",
            milestones=[{"name": "Frontend Fundamentals", "timeline_months": 3}, {"name": "Backend Development", "timeline_months": 3}, {"name": "Database Design", "timeline_months": 2}, {"name": "Full Stack Project", "timeline_months": 4}],
            skills_to_learn=["React/Next.js", "Node.js/Python", "PostgreSQL", "REST/GraphQL", "Docker"],
            recommended_roles=["Full Stack Developer", "Web Developer", "Frontend Engineer"],
            timeline_months=12,
            required_skills=["javascript", "react", "nodejs"],
        ),
        CareerTemplate(
            title="Cloud Architect",
            description="Design cloud infrastructure and strategy. Focus on cloud-native architectures, migration, and optimization.",
            level="advanced",
            milestones=[{"name": "Cloud Platform Deep Dive", "timeline_months": 3}, {"name": "Architecture Design", "timeline_months": 3}, {"name": "Security & Compliance", "timeline_months": 3}, {"name": "Enterprise Migration", "timeline_months": 3}],
            skills_to_learn=["AWS/Azure/GCP", "Microservices", "Serverless", "Cost Optimization", "Disaster Recovery"],
            recommended_roles=["Cloud Architect", "Solutions Architect", "Infrastructure Architect"],
            timeline_months=12,
            required_skills=["cloud", "architecture", "devops"],
        ),
        CareerTemplate(
            title="Mobile App Developer",
            description="Create mobile applications for iOS and Android. Learn native and cross-platform development.",
            level="beginner",
            milestones=[{"name": "Mobile Fundamentals", "timeline_months": 3}, {"name": "UI/UX Design", "timeline_months": 2}, {"name": "API Integration", "timeline_months": 3}, {"name": "App Store Deployment", "timeline_months": 4}],
            skills_to_learn=["Flutter/React Native", "Swift/Kotlin", "Firebase", "App Store Connect", "Mobile UI/UX"],
            recommended_roles=["Mobile Developer", "iOS Developer", "Android Developer"],
            timeline_months=12,
            required_skills=["mobile", "javascript", "swift"],
        ),
        CareerTemplate(
            title="Data Engineer",
            description="Build and maintain data pipelines. Master ETL, data warehousing, and big data technologies.",
            level="intermediate",
            milestones=[{"name": "SQL & Data Modeling", "timeline_months": 2}, {"name": "ETL Pipelines", "timeline_months": 3}, {"name": "Big Data Tools", "timeline_months": 3}, {"name": "Data Warehousing", "timeline_months": 4}],
            skills_to_learn=["SQL", "Python", "Spark", "Airflow", "Snowflake/BigQuery"],
            recommended_roles=["Data Engineer", "Big Data Engineer", "BI Engineer"],
            timeline_months=12,
            required_skills=["sql", "python", "etl"],
        ),
        CareerTemplate(
            title="Product Manager (Technical)",
            description="Bridge business and engineering. Learn product strategy, roadmapping, and stakeholder management.",
            level="advanced",
            milestones=[{"name": "Product Thinking", "timeline_months": 2}, {"name": "User Research", "timeline_months": 2}, {"name": "Strategy & Roadmaps", "timeline_months": 3}, {"name": "Leadership", "timeline_months": 5}],
            skills_to_learn=["Product Strategy", "User Research", "Data Analysis", "Agile/Scrum", "Stakeholder Management"],
            recommended_roles=["Associate Product Manager", "Technical PM", "Product Owner"],
            timeline_months=12,
            required_skills=["communication", "analytics", "leadership"],
        ),
    ]


def get_career_recommendation(student_data: dict, student_level: str) -> dict:
    query = f"{student_data.get('interests', '')} {student_data.get('career_goals', '')} {' '.join(student_data.get('skills', []))}"

    if not os.path.exists(persist_directory):
        initialize_vector_db()

    vectorstore = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
    results = vectorstore.similarity_search(query, k=3)

    context = "\n\n".join([r.page_content for r in results])

    prompt = f"""
You are a career guidance AI. Based on the student profile and reference templates below, create a personalized career recommendation.

Student Profile:
- Level: {student_level}
- Current year: {student_data.get("current_year", "N/A")}
- Skills: {", ".join(student_data.get("skills", []))}
- Languages: {", ".join(student_data.get("programming_languages", []))}
- DSA problems solved: {student_data.get("dsa_problems_solved", 0)}
- Interests: {student_data.get("interests", "N/A")}
- Career goals: {student_data.get("career_goals", "N/A")}

Reference Templates:
{context}

Respond in this exact JSON format (no markdown, no code fences):
{{
    "title": "Career path title",
    "description": "2-3 sentence personalized description",
    "milestones": [{{"name": "milestone name", "timeline_months": N}}],
    "skills_to_learn": ["skill1", "skill2"],
    "recommended_roles": ["role1", "role2"],
    "timeline_months": total_months
}}
"""
    raw = generate(prompt)
    return json.loads(raw)


def save_career_path(student_id: int, level: str, recommendation: dict):
    from app.db.database import SessionLocal
    from app.db.models import CareerPath

    db = SessionLocal()
    path = CareerPath(
        student_id=student_id,
        level=level,
        title=recommendation.get("title"),
        description=recommendation.get("description"),
        milestones=recommendation.get("milestones"),
        skills_to_learn=recommendation.get("skills_to_learn"),
        recommended_roles=recommendation.get("recommended_roles"),
        timeline_months=recommendation.get("timeline_months"),
        raw_recommendation=str(recommendation),
    )
    db.add(path)
    db.commit()
    db.refresh(path)
    db.close()
    return path
