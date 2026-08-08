# ── models.py ─────────────────────────────────────────────────────
# Data-layer classes for "A Girl's Guide to Football".
#
# This module implements the object-oriented data model described in
# Section 4 of the design proposal: the User and QuizScore classes,
# each carrying the responsibilities listed in the class-design table.
# The database helpers live here too, so that ALL data logic sits in
# one place and the route handlers in app.py stay thin (they just call
# these methods and return JSON).
#
# NOTE ON BCRYPT (important — read before wiring into app.py):
# We create an *unbound* Bcrypt() instance here. If models.py imported
# bcrypt from app.py while app.py imported these classes from models.py,
# Python would crash with a circular import. Instead, bcrypt is created
# in this file and "bound" to the app later, from app.py, with:
#       bcrypt.init_app(app)
# That is the standard Flask-extension pattern and avoids the loop.

from flask_bcrypt import Bcrypt
from flask_login import UserMixin
import sqlite3

# Unbound bcrypt — app.py calls bcrypt.init_app(app) so the configured
# work factor (BCRYPT_LOG_ROUNDS = 12, set in app.py) is applied.
bcrypt = Bcrypt()

# Single source of truth for the database file name.
DB_PATH = 'footy.db'


# ── DATABASE HELPERS ──────────────────────────────────────────────
def get_db():
    """Open a connection to the SQLite database.
    row_factory = sqlite3.Row lets us access columns by name
    (e.g. row['username']) instead of by numeric index."""
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the tables if they don't already exist.
    Called once on startup from app.py."""
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


# ── USER ──────────────────────────────────────────────────────────
class User(UserMixin):
    """A registered user.

    Responsibilities (from the Section 4 class-design table):
      register(), verify_password(), get_scores(), get_best_score()

    Extends UserMixin so Flask-Login gets is_authenticated, get_id(),
    etc. for free. Note the constructor now also carries password_hash,
    so verification can live in this class instead of loose in a route."""

    def __init__(self, id, username, email, password_hash=None, created_at=None):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.created_at = created_at

    # ---- construction helper --------------------------------------
    @staticmethod
    def _from_row(row):
        """Turn a database row into a User object (or None if no row).
        Reused by both lookup methods below to avoid repetition."""
        if row is None:
            return None
        return User(
            row['id'], row['username'], row['email'],
            row['password_hash'], row['created_at']
        )

    @classmethod
    def get(cls, user_id):
        """Load a user by primary key. Used by Flask-Login's user_loader.
        The parameterised '?' placeholder prevents SQL injection."""
        conn = get_db()
        row = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        conn.close()
        return cls._from_row(row)

    @classmethod
    def get_by_username(cls, username):
        """Load a user by username. Used by the login route."""
        conn = get_db()
        row = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()
        return cls._from_row(row)

    # ---- responsibilities from the class-design table -------------
    @classmethod
    def register(cls, username, email, password):
        """Validate input, hash the password with bcrypt, and insert a
        new user. Returns (success: bool, message: str). Plain-text
        passwords are NEVER stored — only the bcrypt hash."""
        username = (username or '').strip()
        email = (email or '').strip()
        password = (password or '').strip()

        if not username or not email or not password:
            return False, 'All fields are required.'

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        conn = get_db()
        try:
            conn.execute(
                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                (username, email, password_hash)
            )
            conn.commit()
            return True, 'Account created! You can now log in.'
        except sqlite3.IntegrityError:
            # Raised when the UNIQUE constraint on username/email is hit.
            return False, 'Username or email already exists.'
        finally:
            # finally always runs, so the connection is never leaked —
            # even on the IntegrityError path. Leaking it would leave the
            # database locked for the next write.
            conn.close()

    def verify_password(self, password):
        """Check a candidate password against this user's stored hash.
        Instance method because it acts on THIS user's password_hash."""
        if not self.password_hash:
            return False
        return bcrypt.check_password_hash(self.password_hash, (password or '').strip())

    def get_scores(self):
        """Return this user's quiz attempts, newest first
        (delegates to QuizScore)."""
        return QuizScore.get_by_user(self.id)

    def get_best_score(self):
        """Return this user's highest score, or 0 if they've never played."""
        conn = get_db()
        row = conn.execute(
            'SELECT MAX(score) AS best FROM quiz_scores WHERE user_id = ?',
            (self.id,)
        ).fetchone()
        conn.close()
        return row['best'] if row and row['best'] is not None else 0


# ── QUIZ SCORE ────────────────────────────────────────────────────
class QuizScore:
    """A single quiz attempt.

    Responsibilities (from the Section 4 class-design table):
      save(), get_by_user(), calculate_percentage()"""

    def __init__(self, user_id, score, total, id=None, taken_at=None):
        self.id = id
        self.user_id = user_id
        self.score = score
        self.total = total
        self.taken_at = taken_at

    def is_valid(self):
        """Server-side sanity check — reject impossible scores.
        A client could POST a forged score, so we never trust the value:
        both must be ints, and 0 <= score <= total <= 10."""
        if not isinstance(self.score, int) or not isinstance(self.total, int):
            return False
        return 0 <= self.score <= self.total <= 10

    def save(self):
        """Insert this attempt after validating it.
        Returns True on success, False if the score was invalid."""
        if not self.is_valid():
            return False
        conn = get_db()
        try:
            conn.execute(
                'INSERT INTO quiz_scores (user_id, score, total) VALUES (?, ?, ?)',
                (self.user_id, self.score, self.total)
            )
            conn.commit()
        finally:
            conn.close()
        return True

    def calculate_percentage(self):
        """Return the score as a whole-number percentage.
        Guards against a divide-by-zero if total is somehow 0."""
        if not self.total:
            return 0
        return round((self.score / self.total) * 100)

    @classmethod
    def get_by_user(cls, user_id):
        """Return a list of QuizScore objects for one user, newest first."""
        conn = get_db()
        rows = conn.execute(
            'SELECT id, score, total, taken_at FROM quiz_scores '
            'WHERE user_id = ? ORDER BY taken_at DESC',
            (user_id,)
        ).fetchall()
        conn.close()
        return [cls(user_id, r['score'], r['total'], r['id'], r['taken_at']) for r in rows]

    @staticmethod
    def leaderboard(limit=10):
        """Derived leaderboard: each user's best score, highest first.
        Maps the proposal's note that the Leaderboard is a query, not a
        stored table. Returns a list of {username, best_score} dicts."""
        conn = get_db()
        rows = conn.execute('''
            SELECT u.username, MAX(q.score) AS best_score
            FROM quiz_scores q
            JOIN users u ON u.id = q.user_id
            GROUP BY q.user_id
            ORDER BY best_score DESC
            LIMIT ?
        ''', (limit,)).fetchall()
        conn.close()
        return [dict(r) for r in rows]
