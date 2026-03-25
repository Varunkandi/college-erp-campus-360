import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import sqlite3

app = Flask(__name__)
CORS(app)

app.config["UPLOAD_FOLDER"] = "uploads"

# ---------------- DB ----------------

def get_db():
    conn = sqlite3.connect("college.db")
    conn.row_factory = sqlite3.Row
    return conn


def init_db():

    db = sqlite3.connect("college.db")
    c = db.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        role TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS students(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        fee_due INTEGER
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS faculty(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        subject TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS notifications(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        target_role TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS events(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        event_date TEXT,
        file TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS exams(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT,
        exam_link TEXT
    )
    """)
    c.execute("""
    CREATE TABLE IF NOT EXISTS attendance(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date TEXT,
    status TEXT
    )
    """)

    # admin
    c.execute("SELECT * FROM users WHERE username=?", ("admin",))
    if not c.fetchone():
        c.execute(
            "INSERT INTO users(username,password,role) VALUES(?,?,?)",
            ("admin", "admin", "admin")
        )

    db.commit()
    db.close()


init_db()

# ---------------- HOME ----------------

@app.route("/")
def home():
    return "Backend Running"


# ---------------- LOGIN ----------------

@app.route("/login", methods=["POST"])
def login():

    db = get_db()
    data = request.json

    cur = db.execute(
        "SELECT id,username,role FROM users WHERE username=? AND password=?",
        (data["username"], data["password"])
    )

    user = cur.fetchone()
    db.close()

    if user:
        return jsonify(dict(user))

    return jsonify(None)


# ---------------- ADD STUDENT ----------------

@app.route("/add_student", methods=["POST"])
def add_student():

    db = get_db()
    data = request.json

    cur = db.cursor()

    cur.execute(
        "INSERT INTO users(username,password,role) VALUES(?,?,?)",
        (data["username"], data["password"], "student")
    )

    uid = cur.lastrowid

    cur.execute(
        "INSERT INTO students(user_id,name,fee_due) VALUES(?,?,?)",
        (uid, data["name"], data.get("fee_due", 0))
    )

    db.commit()
    db.close()

    return jsonify({"message": "ok"})


# ---------------- ALL STUDENTS ----------------

@app.route("/all_students")
def all_students():

    db = get_db()

    cur = db.execute("""
    SELECT users.id AS uid,
           students.name,
           users.username,
           students.fee_due
    FROM students
    JOIN users ON users.id = students.user_id
    """)

    data = cur.fetchall()
    db.close()

    return jsonify([dict(x) for x in data])


# ---------------- ADD FACULTY ----------------

@app.route("/add_faculty", methods=["POST"])
def add_faculty():

    db = get_db()
    data = request.json

    cur = db.cursor()

    cur.execute(
        "INSERT INTO users(username,password,role) VALUES(?,?,?)",
        (data["username"], data["password"], "faculty")
    )

    uid = cur.lastrowid

    cur.execute(
        "INSERT INTO faculty(user_id,name,subject) VALUES(?,?,?)",
        (uid, data["name"], data["subject"])
    )

    db.commit()
    db.close()

    return jsonify({"message": "ok"})


# ---------------- ALL FACULTY ----------------

@app.route("/all_faculty")
def all_faculty():

    db = get_db()

    cur = db.execute("""
    SELECT users.id AS uid,
           faculty.name,
           faculty.subject
    FROM faculty
    JOIN users ON users.id = faculty.user_id
    """)

    data = cur.fetchall()
    db.close()

    return jsonify([dict(x) for x in data])


# ---------------- UPDATE FEE ----------------

@app.route("/update_fee", methods=["POST"])
def update_fee():

    db = get_db()
    data = request.json

    db.execute(
        "UPDATE students SET fee_due=? WHERE user_id=?",
        (data["fee_due"], data["student_id"])
    )

    db.commit()
    db.close()

    return jsonify({"message": "ok"})


# ---------------- EVENTS ----------------

@app.route("/events")
def events():

    db = get_db()
    cur = db.execute("SELECT * FROM events")

    data = cur.fetchall()
    db.close()

    return jsonify([dict(x) for x in data])


@app.route("/add_event", methods=["POST"])
def add_event():

    db = get_db()

    title = request.form["title"]
    description = request.form.get("description")
    date = request.form["event_date"]

    file = request.files.get("file")

    filename = None

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join("uploads", filename))

    db.execute(
        "INSERT INTO events(title,description,event_date,file) VALUES(?,?,?,?)",
        (title, description, date, filename)
    )

    db.commit()
    db.close()

    return jsonify({"message": "ok"})


# ---------------- NOTIFICATIONS ----------------

@app.route("/send_notification", methods=["POST"])
def send_notification():

    db = get_db()
    data = request.json

    db.execute(
        "INSERT INTO notifications(message,target_role) VALUES(?,?)",
        (data["message"], data["target_role"])
    )

    db.commit()
    db.close()

    return jsonify({"message": "ok"})



# ---------------- EXAMS ----------------

@app.route("/add_exam", methods=["POST"])
def add_exam():

    db = get_db()
    data = request.json

    db.execute(
        "INSERT INTO exams(subject,exam_link) VALUES(?,?)",
        (data["subject"], data["exam_link"])
    )

    db.commit()
    db.close()

    return jsonify({"message": "ok"})


# ---------------- dash count ----------------

@app.route("/counts")
def counts():

    db = get_db()

    cur1 = db.execute("SELECT COUNT(*) FROM students")
    students = cur1.fetchone()[0]

    cur2 = db.execute("SELECT COUNT(*) FROM faculty")
    faculty = cur2.fetchone()[0]

    db.close()

    return jsonify({
        "students": students,
        "faculty": faculty
    })

@app.route("/student_list")
def student_list():

    db = get_db()

    cur = db.execute("""
    SELECT users.id AS uid,
           students.id AS student_id,
           students.name
    FROM students
    JOIN users ON users.id = students.user_id
    """)

    data = cur.fetchall()
    db.close()

    return jsonify([dict(x) for x in data])
    

@app.route("/save_attendance", methods=["POST"])
def save_attendance():

    db = get_db()
    data = request.json

    for row in data["records"]:

        db.execute(
            "INSERT INTO attendance(student_id,date,status) VALUES(?,?,?)",
            (
                row["student_id"],
                data["date"],
                row["status"]
            )
        )

    db.commit()
    db.close()

    return jsonify({"message": "ok"})

# ----------------  notifications ----------------

@app.route("/notifications/<role>")
def notifications(role):

    db = get_db()

    cur = db.execute(
        "SELECT * FROM notifications WHERE target_role=? OR target_role='everyone'",
        (role,)
    )

    data = cur.fetchall()
    db.close()

    return jsonify([dict(x) for x in data])

@app.route("/exams")
def exams():

    db = get_db()

    cur = db.execute(
        "SELECT id,subject,exam_link FROM exams"
    )

    data = cur.fetchall()
    db.close()

    return jsonify([dict(x) for x in data])


# ---------------- RUN ----------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)