from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import sqlite3
import os
import urllib.request
import json

app = Flask(__name__)
app.secret_key = 'footy_secret_key_change_this_later'

bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'home'

GROQ_API_KEY = "yourAPIkey"
GROQ_MODEL = "llama3-8b-8192"

# ── DATABASE ──────────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect('footy.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS quiz_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    conn.commit()
    conn.close()

# ── USER MODEL ────────────────────────────────────────────────────
class User(UserMixin):
    def __init__(self, id, username, email):
        self.id = id
        self.username = username
        self.email = email

@login_manager.user_loader
def load_user(user_id):
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    if user:
        return User(user['id'], user['username'], user['email'])
    return None

# ── ROUTES ────────────────────────────────────────────────────────
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if not username or not email or not password:
        return jsonify({'success': False, 'message': 'All fields are required.'})

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        conn = get_db()
        conn.execute('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                     (username, email, password_hash))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Account created! You can now log in.'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Username or email already exists.'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user['password_hash'], password):
        user_obj = User(user['id'], user['username'], user['email'])
        login_user(user_obj)
        return jsonify({'success': True, 'username': user['username']})
    
    return jsonify({'success': False, 'message': 'Incorrect username or password.'})

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'success': True})

@app.route('/save_score', methods=['POST'])
@login_required
def save_score():
    data = request.get_json()
    score = data.get('score')
    total = data.get('total')
    conn = get_db()
    conn.execute('INSERT INTO quiz_scores (user_id, score, total) VALUES (?, ?, ?)',
                 (current_user.id, score, total))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/my_scores')
@login_required
def my_scores():
    conn = get_db()
    scores = conn.execute(
        'SELECT score, total, taken_at FROM quiz_scores WHERE user_id = ? ORDER BY taken_at DESC',
        (current_user.id,)
    ).fetchall()
    conn.close()
    return jsonify({'scores': [dict(s) for s in scores]})

@app.route('/leaderboard')
def leaderboard():
    conn = get_db()
    rows = conn.execute('''
        SELECT u.username, MAX(q.score) as best_score
        FROM quiz_scores q
        JOIN users u ON u.id = q.user_id
        GROUP BY q.user_id
        ORDER BY best_score DESC
        LIMIT 10
    ''').fetchall()
    conn.close()
    return jsonify({'leaderboard': [dict(r) for r in rows]})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    
    FOOTY_SYSTEM_PROMPT = """You are Footy, a friendly and knowledgeable football guide on A Girl's Guide to Football.
You ONLY answer questions about football. If asked about anything else, politely decline and redirect to football topics."""

    groq_body = json.dumps({
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": FOOTY_SYSTEM_PROMPT}
        ] + data.get('messages', [])
    }).encode()

    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=groq_body,
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer " + GROQ_API_KEY
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            groq_data = json.loads(resp.read())
        result = {
            "content": [{
                "type": "text",
                "text": groq_data["choices"][0]["message"]["content"]
            }]
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/current_user_info')
def current_user_info():
    if current_user.is_authenticated:
        return jsonify({'logged_in': True, 'username': current_user.username})
    return jsonify({'logged_in': False})

# ── RUN ───────────────────────────────────────────────────────────
if __name__ == '__main__':
    init_db()
    print('Footy app running at http://localhost:5000')
    app.run(debug=True)