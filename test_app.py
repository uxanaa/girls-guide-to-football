"""
Unit and integration tests for A Girl's Guide to Football.
Run with:  python -m unittest test_app.py -v
"""
import unittest
import os
import models
from models import User, QuizScore, ChatMessage


class TestPasswordHashing(unittest.TestCase):
    """Unit tests for bcrypt password hashing and verification."""

    def setUp(self):
        # Use a fresh test database for each test run
        models.DB_PATH = 'test_footy.db'
        if os.path.exists('test_footy.db'):
            os.remove('test_footy.db')
        models.init_db()

    def test_password_is_hashed_not_plaintext(self):
        # After registering, the stored hash must not equal the plain password
        User.register('alice', 'alice@example.com', 'secret123')
        user = User.get_by_username('alice')
        self.assertNotEqual(user.password_hash, 'secret123')

    def test_correct_password_verifies(self):
        User.register('bob', 'bob@example.com', 'password1')
        user = User.get_by_username('bob')
        self.assertTrue(user.verify_password('password1'))

    def test_wrong_password_rejected(self):
        User.register('cara', 'cara@example.com', 'password1')
        user = User.get_by_username('cara')
        self.assertFalse(user.verify_password('wrongpassword'))


class TestRegistrationValidation(unittest.TestCase):
    """Unit tests for account registration rules."""

    def setUp(self):
        models.DB_PATH = 'test_footy.db'
        if os.path.exists('test_footy.db'):
            os.remove('test_footy.db')
        models.init_db()

    def test_empty_fields_rejected(self):
        success, _ = User.register('', '', '')
        self.assertFalse(success)

    def test_duplicate_username_rejected(self):
        User.register('dan', 'dan@example.com', 'pass1234')
        success, message = User.register('dan', 'other@example.com', 'pass1234')
        self.assertFalse(success)
        self.assertIn('already exists', message)


class TestQuizScoreValidation(unittest.TestCase):
    """Unit tests for server-side quiz score validation."""

    def test_valid_score_accepted(self):
        self.assertTrue(QuizScore(1, 7, 10).is_valid())

    def test_score_above_total_rejected(self):
        self.assertFalse(QuizScore(1, 99, 10).is_valid())

    def test_negative_score_rejected(self):
        self.assertFalse(QuizScore(1, -1, 10).is_valid())

    def test_non_integer_score_rejected(self):
        self.assertFalse(QuizScore(1, 'abc', 10).is_valid())

    def test_percentage_calculation(self):
        self.assertEqual(QuizScore(1, 8, 10).calculate_percentage(), 80)


class TestChatMessageValidation(unittest.TestCase):
    """Unit tests for server-side chat message validation."""

    def test_valid_message_accepted(self):
        self.assertTrue(ChatMessage(1, 'alice', 'Hello football fans').is_valid())

    def test_empty_message_rejected(self):
        self.assertFalse(ChatMessage(1, 'alice', '   ').is_valid())

    def test_overlong_message_rejected(self):
        self.assertFalse(ChatMessage(1, 'alice', 'z' * 400).is_valid())


class TestAuthenticationFlow(unittest.TestCase):
    """Integration test: register then log in end-to-end."""

    def setUp(self):
        models.DB_PATH = 'test_footy.db'
        if os.path.exists('test_footy.db'):
            os.remove('test_footy.db')
        models.init_db()

    def test_register_then_login_succeeds(self):
        # Register
        success, _ = User.register('emma', 'emma@example.com', 'pass1234')
        self.assertTrue(success)
        # Retrieve and verify the correct password (simulating login)
        user = User.get_by_username('emma')
        self.assertIsNotNone(user)
        self.assertTrue(user.verify_password('pass1234'))
        # A wrong password on the same account fails
        self.assertFalse(user.verify_password('nope'))


if __name__ == '__main__':
    unittest.main(verbosity=2)
