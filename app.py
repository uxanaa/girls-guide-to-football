from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import Flask, render_template, request, redirect, session, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_wtf.csrf import CSRFProtect
from datetime import timedelta
from dotenv import load_dotenv
import os
import urllib.request
import json
from models import bcrypt, init_db, User, QuizScore

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'fallback-dev-key')
app.config['BCRYPT_LOG_ROUNDS'] = 12

# User sessions expire after 30 minutes of inactivity
app.permanent_session_lifetime = timedelta(minutes=30)

bcrypt.init_app(app)   # bcrypt now comes from models.py
login_manager = LoginManager(app)
login_manager.login_view = 'home'

# CSRF protection, guards all state-changing (POST) requests.
# The token is rendered into the page via csrf_token() and sent
# back by the frontend in the X-CSRFToken header on each POST.
csrf = CSRFProtect(app)

# Rate limiting. Tracks requests per client IP. No global limits are set,
# so only routes with a @limiter.limit(...) decorator are throttled.
# (Uses in-memory storage — fine for this project; a production app would
# point storage_uri at Redis.)
limiter = Limiter(get_remote_address, app=app)

# When a rate limit is exceeded Flask-Limiter returns HTTP 429. This
# handler returns it in the shape footy.js expects so the message shows
# up as a normal chat reply rather than a broken response.
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"content": [{"type": "text",
        "text": "Whoa, slow down! You've sent too many messages — please wait a minute and try again."}]}), 429

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')


# Security headers — applied to every response
@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response


@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

# ── ROUTES ────────────────────────────────────────────────────────
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    success, message = User.register(
        data.get('username'), data.get('email'), data.get('password')
    )
    return jsonify({'success': success, 'message': message})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    user = User.get_by_username(username)
    if user and user.verify_password(password):
        session.permanent = True
        login_user(user)
        return jsonify({'success': True, 'username': user.username})

    return jsonify({'success': False, 'message': 'Incorrect username or password.'})

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'success': True})

@app.route('/save_score', methods=['POST'])
@login_required
def save_score():
    data = request.get_json()
    attempt = QuizScore(current_user.id, data.get('score'), data.get('total'))
    if not attempt.save():
        return jsonify({'success': False, 'message': 'Invalid or out-of-range score.'}), 400
    return jsonify({'success': True})

@app.route('/my_scores')
@login_required
def my_scores():
    scores = current_user.get_scores()
    return jsonify({
        'best_score': current_user.get_best_score(),
        'scores': [
            {'score': s.score, 'total': s.total,
             'percentage': s.calculate_percentage(), 'taken_at': s.taken_at}
            for s in scores
        ]
    })

@app.route('/leaderboard')
def leaderboard():
    return jsonify({'leaderboard': QuizScore.leaderboard(10)})

@app.route('/chat', methods=['POST'])
@limiter.limit("10 per minute")
def chat():
    data = request.get_json()
    
    
# ── SYSTEM PROMPT ─────────────────────────────────────────────
# This is the instruction we send to the AI before every conversation.
# It tells the AI who it is and what it is allowed to talk about.
# This is your "prompt injection defence" the AI is told to ignore
# any attempt to make it talk about non-football topics.


    FOOTY_SYSTEM_PROMPT = """You are Footy, a friendly and knowledgeable football (soccer) guide on a website called "A Girl's Guide to Football", designed to help girls and young women learn about football.

You ONLY answer questions about football (soccer). This includes: rules, player positions, leagues, clubs, famous players, tactics, formations, football history, transfers, and tournaments such as the World Cup, Champions League, and Premier League.

If the user asks about ANYTHING not related to football, politely decline and redirect them back to football. Do not answer questions about other sports, general knowledge, personal advice, technology, politics, or any non-football topic.

Keep your answers friendly, clear, encouraging and accessible. Your audience may be new to football so use simple language and briefly explain football terms when you use them."""

    messages = data.get('messages', [])

    body = json.dumps({
        "model": "google/gemma-4-26b-a4b-it:free",
        "messages": [
            {"role": "system", "content": FOOTY_SYSTEM_PROMPT}
        ] + messages
    }).encode()

    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer " + OPENROUTER_API_KEY,
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "A Girls Guide to Football"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result_data = json.loads(resp.read())
        text = result_data["choices"][0]["message"]["content"]

        # Lightweight response validation: guard against an empty reply
        # and cap the length so one response can't flood the chat window.
        if not text or not text.strip():
            text = "Sorry, I couldn't answer that — try asking me something about football!"
        text = text[:2000]

        return jsonify({"content": [{"type": "text", "text": text}]})
    except Exception as e:
        print("CHAT ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/current_user_info')
def current_user_info():
    if current_user.is_authenticated:
        return jsonify({'logged_in': True, 'username': current_user.username})
    return jsonify({'logged_in': False})

if __name__ == '__main__':
    init_db()
    print('Footy app running at http://localhost:5000')
    app.run(debug=False)
