import os
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['UPLOAD_FOLDER'] = 'uploads'

# ======================
# DATABASE CONNECTION
# ======================

def get_db():
    conn = sqlite3.connect("college.db")
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = sqlite3.connect("college.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        role TEXT
    )
    """)

    cursor.execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ("admin", "admin", "admin")
    )

    conn.commit()
    conn.close()

init_db()

# ======================
# HOME
# ======================
@app.route("/")
def home():
    return "Backend Running Successfully"

# ======================
# LOGIN
# ======================
@app.route("/login", methods=["POST"])
def login():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    cursor.execute(
        "SELECT id, username, role FROM users WHERE username=? AND password=?",
        (data["username"], data["password"])
    )

    user = cursor.fetchone()
    db.close()

    if user:
        return jsonify(dict(user))
    else:
        return jsonify(None)

# ======================
# ADD STUDENT
# ======================
@app.route("/add_student", methods=["POST"])
def add_student():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    fee = data.get("fee_due", 0)
    if fee == "" or fee is None:
        fee = 0

    # create user
    cursor.execute(
        "INSERT INTO users(username,password,role) VALUES(?,?,'student')",
        (data["username"], data["password"])
    )

    user_id = cursor.lastrowid

    # create student
    cursor.execute("""
        INSERT INTO students(
            user_id,name,fee_due,
            register_no,course,academic_info,institution,
            dob,gender,father_name,mother_name,
            address,nationality,religion,district,state
        )
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """,(
        user_id,
        data.get("name"),
        fee,
        data.get("register_no"),
        data.get("course"),
        data.get("academic_info"),
        data.get("institution"),
        data.get("dob"),
        data.get("gender"),
        data.get("father_name"),
        data.get("mother_name"),
        data.get("address"),
        data.get("nationality"),
        data.get("religion"),
        data.get("district"),
        data.get("state")
    ))

    db.commit()
    db.close()

    return jsonify({"message":"Student Added Successfully"})

# ======================
# ADD FACULTY
# ======================
@app.route("/add_faculty", methods=["POST"])
def add_faculty():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO users(username,password,role) VALUES(?,?,'faculty')",
        (data["username"], data["password"])
    )

    user_id = cursor.lastrowid

    cursor.execute(
        "INSERT INTO faculty(user_id,name,subject) VALUES(?,?,?)",
        (user_id, data["name"], data["subject"])
    )

    db.commit()
    db.close()
    return jsonify({"message":"Faculty Added Successfully"})

# ======================
# ADD ATTENDANCE
# ======================
@app.route("/add_attendance", methods=["POST"])
def add_attendance():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO attendance(student_id,date,status) VALUES(?,?,?)",
        (data["student_id"], data["date"], data["status"])
    )

    db.commit()
    db.close()
    return jsonify({"message":"Attendance Marked"})

# ======================
# VIEW ATTENDANCE
# ======================

@app.route("/attendance/<int:user_id>")
def view_attendance(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT a.date, a.status
        FROM attendance a
        JOIN students s ON a.student_id=s.id
        WHERE s.user_id=%s
    """,(user_id,))

    data = cursor.fetchall()
    db.close()
    return jsonify(data)

# ======================
# ADD MARKS
# ======================

# ======================
# VIEW MARKS
# ======================

@app.route("/marks/<int:user_id>")
def view_marks(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT m.subject, m.marks
        FROM marks m
        JOIN students s ON m.student_id=s.id
        WHERE s.user_id=%s
    """,(user_id,))

    data = cursor.fetchall()
    db.close()
    return jsonify(data)


# ======================
# VIEW FEE
# ======================
@app.route("/fee/<int:user_id>")
def view_fee(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT fee_due FROM students WHERE user_id=?",
        (user_id,)
    )

    fee = cursor.fetchone()
    db.close()
    return jsonify(fee)


# ======================
# UPDATE FEE
# ======================
@app.route("/update_fee", methods=["POST"])
def update_fee():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    cursor.execute(
        "UPDATE students SET fee_due=? WHERE user_id=?",
        (data["fee_due"], data["student_id"])
    )

    db.commit()
    db.close()
    return jsonify({"message":"Fee Updated Successfully"})

# ======================
# ALL STUDENTS
# ======================
@app.route("/all_students")
def all_students():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT u.id AS uid,s.id AS student_id,
        s.name,s.fee_due,u.username,u.password
        FROM students s
        JOIN users u ON s.user_id=u.id
    """)

    data = cursor.fetchall()
    db.close()
    return jsonify(data)

# ======================
# ALL FACULTY
# ======================
@app.route("/all_faculty")
def all_faculty():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            u.id AS user_id,   -- THIS IS UID
            f.name,
            f.subject
        FROM faculty f
        JOIN users u ON f.user_id = u.id
    """)

    data = cursor.fetchall()
    db.close()
    return jsonify(data)


# ======================
# COUNTS
# ======================
@app.route("/counts")
def counts():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT COUNT(*) FROM students")
    students = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM faculty")
    faculty = cursor.fetchone()[0]

    db.close()
    return jsonify({"students":students,"faculty":faculty})

#ATTENDANCE SUMMARY (Percentage)

@app.route("/attendance_summary/<int:user_id>")
def attendance_summary(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
        SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS present,
        COUNT(*) AS total
        FROM attendance a
        JOIN students s ON a.student_id=s.id
        WHERE s.user_id=%s
    """,(user_id,))

    data = cursor.fetchone()
    db.close()
    return jsonify(data)
#NOTES UPLOAD
@app.route("/upload_notes", methods=["POST"])
def upload_notes():
    db = get_db()
    file = request.files["file"]
    subject = request.form["subject"]
    uploaded_by = request.form["uploaded_by"]  # faculty user_id

    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO notes(subject, filename, uploaded_by) VALUES(?,?,?)",
        (subject, filename, uploaded_by)
    )

    db.commit()
    db.close()
    return jsonify({"message": "Notes uploaded successfully"})
#faculty_notes
@app.route("/faculty_notes/<int:faculty_id>")
def faculty_notes(faculty_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, subject, filename FROM notes WHERE uploaded_by=%s",
        (faculty_id,)
    )

    data = cursor.fetchall()
    db.close()
    return jsonify(data)

#delete_note
@app.route("/delete_note/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    db = get_db()
    cursor = db.cursor()

    # get filename
    cursor.execute("SELECT filename FROM notes WHERE id=%s", (note_id,))
    row = cursor.fetchone()

    if row:
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], row[0])
        if os.path.exists(filepath):
            os.remove(filepath)

    cursor.execute("DELETE FROM notes WHERE id=%s", (note_id,))
    db.commit()
    db.close()

    return jsonify({"message": "Note removed successfully"})

#get notes
@app.route("/notes")
def get_notes():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM notes")
    data = cursor.fetchall()
    db.close()
    return jsonify(data)
#download notes

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory("uploads", filename)
#get all student att
@app.route("/student_list")
def student_list():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT s.id AS student_id,
               u.id AS uid,
               s.name
        FROM students s
        JOIN users u ON s.user_id=u.id
    """)

    data = cursor.fetchall()
    db.close()
    return jsonify(data)

# SAVE ATTENDANCE (Faculty + Admin)
@app.route("/save_attendance", methods=["POST"])
def save_attendance():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    for row in data["records"]:
        cursor.execute("""
            INSERT INTO attendance(student_id,date,hour,status,marked_by)
            VALUES(%s,%s,%s,%s,%s)
            ON DUPLICATE KEY UPDATE
            status=%s,
            marked_by=%s
        """,(
            row["student_id"],
            data["date"],
            row["hour"],
            row["status"],
            data["role"],
            row["status"],
            data["role"]
        ))

    db.commit()
    db.close()
    return jsonify({"message":"Attendance Saved"})

#VIEW ATTENDANCE (ADMIN / FACULTY)
@app.route("/attendance_day/<date>")
def attendance_day(date):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM attendance
        WHERE date=%s
    """,(date,))

    data = cursor.fetchall()
    db.close()
    return jsonify(data)

#delete_student

@app.route("/delete_student/<int:user_id>", methods=["DELETE"])
def delete_student(user_id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM students WHERE user_id=?", (user_id,))
    cursor.execute("DELETE FROM users WHERE id=%s", (user_id,))

    db.commit()
    db.close()

    return jsonify({"message": "Student removed successfully"})

# ======================
# DELETE FACULTY
# ======================

@app.route("/delete_faculty/<int:user_id>", methods=["DELETE"])
def delete_faculty(user_id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM faculty WHERE user_id=?", (user_id,))
    cursor.execute("DELETE FROM users WHERE id=%s", (user_id,))

    db.commit()
    db.close()

    return jsonify({"message": "Faculty removed successfully"})


#admin_add_attendance
@app.route("/admin_add_attendance", methods=["POST"])
def admin_add_attendance():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    for row in data["records"]:
        cursor.execute("""
            INSERT INTO attendance(student_id,date,hour,status,marked_by)
            VALUES(%s,%s,%s,%s,%s)
        """,(
            row["student_id"],
            data["date"],
            row["hour"],
            row["status"],
            "admin"
        ))

    db.commit()
    db.close()

    return jsonify({"message": "Admin attendance saved"})

#faculty_add_attendance
@app.route("/faculty_add_attendance", methods=["POST"])
def faculty_add_attendance():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    for row in data["records"]:
        cursor.execute("""
            INSERT INTO attendance(student_id,date,hour,status,marked_by)
            VALUES(%s,%s,%s,%s,%s)
        """,(
            row["student_id"],
            data["date"],
            row["hour"],
            row["status"],
            "faculty"
        ))

    db.commit()
    db.close()
    return jsonify({"message":"Faculty attendance saved"})



#add_marks

@app.route("/add_marks", methods=["POST"])
def add_marks():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO marks(student_id,subject,marks) VALUES(?,?,?)",
        (data["student_id"], data["subject"], data["marks"])
    )

    db.commit()
    db.close()
    return jsonify({"message":"Marks Added"})
#student_attendance_report
@app.route("/student_attendance_report/<int:user_id>")
def student_attendance_report(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    # get attendance records
    cursor.execute("""
        SELECT a.date, a.hour, a.status
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE s.user_id = %s
        ORDER BY a.date
    """, (user_id,))

    records = cursor.fetchall()

    # calculate summary
    cursor.execute("""
        SELECT 
            SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present_count,
            COUNT(*) AS total_count
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE s.user_id=%s
    """, (user_id,))

    summary = cursor.fetchone()

    db.close()

    return jsonify({
        "records": records,
        "present": summary["present_count"] or 0,
        "total": summary["total_count"] or 0
    })

# ======================
# UPDATE STUDENT PROFILE
# ======================
@app.route("/update_student_profile/<int:user_id>", methods=["POST"])
def update_student_profile(user_id):
    db = get_db()
    data = request.json
    cursor = db.cursor()

    cursor.execute("""
        UPDATE students SET
            name=%s,
            register_no=%s,
            course=%s,
            academic_info=%s,
            institution=%s,
            dob=%s,
            gender=%s,
            father_name=%s,
            mother_name=%s,
            address=%s,
            nationality=%s,
            religion=%s,
            district=%s,
            state=%s
        WHERE user_id=?
    """, (
        data.get("name"),
        data.get("register_no"),
        data.get("course"),
        data.get("academic_info"),
        data.get("institution"),
        data.get("dob"),
        data.get("gender"),
        data.get("father_name"),
        data.get("mother_name"),
        data.get("address"),
        data.get("nationality"),
        data.get("religion"),
        data.get("district"),
        data.get("state"),
        user_id
    ))

    db.commit()
    db.close()

    return jsonify({"message": "Student profile updated successfully"})


# ======================
# GET STUDENT PROFILE (IMPORTANT FOR ADMIN + STUDENT)
# ======================
@app.route("/student_profile/<int:user_id>")
def student_profile(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM students
        WHERE user_id=?
    """, (user_id,))

    data = cursor.fetchone()
    db.close()
    return jsonify(data)

# ======================
# GET ALL EVENTS
# ======================
@app.route("/events")
def get_events():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT id,title,description,event_date,file,uploaded_by,role
        FROM events
        ORDER BY event_date DESC
    """)

    data = cursor.fetchall()
    db.close()
    return jsonify(data)

# ======================
# ADD EVENT
# ======================
@app.route("/add_event", methods=["POST"])
def add_event():
    db = get_db()

    title = request.form["title"]
    description = request.form.get("description")
    event_date = request.form["event_date"]
    uploaded_by = request.form["uploaded_by"]
    role = request.form["role"]

    file = request.files.get("file")
    filename = None

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO events(title,description,event_date,file,uploaded_by,role)
        VALUES(%s,%s,%s,%s,%s,%s)
    """,(title,description,event_date,filename,uploaded_by,role))

    db.commit()
    db.close()

    return jsonify({"message":"Event added successfully"})

# ======================
# DELETE EVENT
# ======================
@app.route("/delete_event/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    db = get_db()
    cursor = db.cursor()

    # remove file if exists
    cursor.execute("SELECT file FROM events WHERE id=%s",(event_id,))
    row = cursor.fetchone()

    if row and row[0]:
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], row[0])
        if os.path.exists(filepath):
            os.remove(filepath)

    cursor.execute("DELETE FROM events WHERE id=%s",(event_id,))
    db.commit()
    db.close()

    return jsonify({"message":"Event deleted"})

# ======================
# SEND NOTIFICATION
# ======================
@app.route("/send_notification", methods=["POST"])
def send_notification():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO notifications(message,target_role)
        VALUES(%s,%s)
    """,(data["message"], data["target_role"]))

    db.commit()
    db.close()

    return jsonify({"message":"Notification sent"})

# ======================
# GET NOTIFICATIONS
# ======================
@app.route("/notifications/<role>")
def get_notifications(role):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM notifications
        WHERE target_role=%s OR target_role='everyone'
        ORDER BY id DESC
    """,(role,))

    data = cursor.fetchall()
    db.close()
    return jsonify(data)

# ======================
# ANNOUNCEMENTS
# ======================

@app.route("/send_announcement", methods=["POST"])
def send_announcement():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO notifications(message, target_role)
        VALUES(%s,%s)
    """, (
        data["message"],
        "everyone"
    ))

    db.commit()
    db.close()

    return jsonify({"message": "Announcement sent"})


@app.route("/announcements")
def get_announcements():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT message, created_at
        FROM notifications
        WHERE target_role='everyone'
        ORDER BY created_at DESC
        LIMIT 5
    """)

    data = cursor.fetchall()
    db.close()
    return jsonify(data)

# ======================
# DELETE NOTIFICATION (ADMIN ONLY)
# ======================
@app.route("/delete_notification/<int:nid>", methods=["DELETE"])
def delete_notification(nid):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM notifications WHERE id=%s", (nid,))

    db.commit()
    db.close()

    return jsonify({"message":"Notification deleted"})
    # GET ALL NOTIFICATIONS (ADMIN PAGE)
@app.route("/all_notifications")
def all_notifications():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, message, target_role, created_at
        FROM notifications
        ORDER BY created_at DESC
    """)

    data = cursor.fetchall()
    db.close()
    return jsonify(data)

#exam

@app.route("/add_exam", methods=["POST"])
def add_exam():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO exams(subject, exam_link, created_by)
        VALUES(?,?,?)
    """, (
        data["subject"],
        data["exam_link"],
        data["created_by"]
    ))

    db.commit()
    db.close()
    return jsonify({"message":"Exam added"})

# get all exams

@app.route("/exams")
def get_exams():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, subject, exam_link
        FROM exams
        ORDER BY created_at DESC
    """)

    data = cursor.fetchall()
    db.close()
    return jsonify(data)
    
    
# Delete exam 
@app.route("/delete_exam/<int:id>", methods=["DELETE"])
def delete_exam(id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM exams WHERE id=%s",(id,))
    db.commit()
    db.close()

    return jsonify({"message":"Exam removed"})

#temp
with get_db() as db:
    cursor = db.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS test(id INTEGER)")
    db.commit()

# ======================
# RUN SERVER
# ======================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)


    
