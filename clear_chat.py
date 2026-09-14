import sqlite3
conn = sqlite3.connect('footy.db')
conn.execute('DELETE FROM chat_messages')
conn.commit()
conn.close()
print('Chat messages cleared')