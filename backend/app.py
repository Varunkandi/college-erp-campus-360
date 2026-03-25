import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import sqlite3

app = Flask(__name__)
CORS(app)

app.config["UPLOAD_FOLDER"] = "uploads"

# ----------------------
# DB
# ----------------------

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
    CREATE TABLE IF NOT EXISTS attendance(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        date TEXT,
        status TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS marks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        subject TEXT,
        marks TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS notifications(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        role TEXT
    )
    """)

    # default admin
    c.execute("SELECT * FROM users WHERE username=?", ("admin",))
    if not c.fetchone():
        c.execute(
            "INSERT INTO users(username,password,role) VALUES(?,?,?)",
            ("admin", "admin", "admin")
        )

    db.commit()
    db.close()


init_db()

# ----------------------
# HOME
# ----------------------

@app.route("/")
def home():
    return "Backend Running Successfully"


# ----------------------
# LOGIN
# ----------------------

@app.route("/login", methods=["POST"])
def login():
    db = get_db()
    data = request.json

    cur = db.cursor()
    cur.execute(
        "SELECT id,username,role FROM users WHERE username=? AND password=?",
        (data["username"], data["password"])
    )

    user = cur.fetchone()
    db.close()

    if user:
        return jsonify(dict(user))
    else:
        return jsonify(None)


# ----------------------
# ADD STUDENT
# ----------------------

@app.route("/add_student", methods=["POST"])
def add_student():

    db = get_db()
    data = request.json
    cur = db.cursor()

    cur.execute(
        "INSERT INTO users(username,password,role) VALUES(?,?,?)",
        (data["username"], data["password"], "student")
    )

    user_id = cur.lastrowid

    fee = data.get("fee_due", 0)

    cur.execute(
        "INSERT INTO students(user_id,name,fee_due) VALUES(?,?,?)",
        (user_id, data["name"], fee)
    )

    db.commit()
    db.close()

    return jsonify({"msg": "student added"})


# ----------------------
# ADD FACULTY
# ----------------------

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

    return jsonify({"msg": "faculty added"})


# ----------------------
# ALL STUDENTS
# ----------------------

@app.route("/all_students")
def all_students():

    db = get_db()
    cur = db.cursor()

    cur.execute("""
    SELECT users.id, students.name, students.fee_due
    FROM users
    JOIN students ON users.id = students.user_id
    """)

    data = cur.fetchall()
    db.close()

    return jsonify([dict(x) for x in data])


# ----------------------
# ATTENDANCE
# ----------------------

@app.route("/add_attendance", methods=["POST"])
def add_attendance():

    db = get_db()
    data = request.json

    db.execute(
        "INSERT INTO attendance(student_id,date,status) VALUES(?,?,?)",
        (data["student_id"], data["date"], data["status"])
    )

    db.commit()
    db.close()

    return jsonify({"msg": "ok"})


# ----------------------
# MARKS
# ----------------------

@app.route("/add_marks", methods=["POST"])
def add_marks():

    db = get_db()
    data = request.json

    db.execute(
        "INSERT INTO marks(student_id,subject,marks) VALUES(?,?,?)",
        (data["student_id"], data["subject"], data["marks"])
    )

    db.commit()
    db.close()

    return jsonify({"msg": "ok"})


# ----------------------
# FEE
# ----------------------

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

    return jsonify({"msg": "ok"})


# ----------------------
# NOTIFICATIONS
# ----------------------

@app.route("/send_notification", methods=["POST"])
def send_notification():

    db = get_db()
    data = request.json

    db.execute(
        "INSERT INTO notifications(message,role) VALUES(?,?)",
        (data["message"], data["role"])
    )

    db.commit()
    db.close()

    return jsonify({"msg": "sent"})


@app.route("/notifications/<role>")
def notifications(role):

    db = get_db()

    cur = db.execute(
        "SELECT * FROM notifications WHERE role=? OR role='everyone'",
        (role,)
    )

    data = cur.fetchall()
    db.close()

    return jsonify([dict(x) for x in data])


# ----------------------
# FILES
# ----------------------

@app.route("/upload", methods=["POST"])
def upload():

    file = request.files["file"]

    filename = secure_filename(file.filename)

    file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

    return jsonify({"file": filename})


@app.route("/uploads/<name>")
def files(name):
    return send_from_directory("uploads", name)


# ----------------------
# RUN
# ----------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)