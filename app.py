from flask import Flask, render_template, request, redirect, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

# Initialize database
def init_db():
    with sqlite3.connect('tasks.db') as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS tasks (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            content TEXT NOT NULL,
                            timestamp TEXT NOT NULL,
                            completed INTEGER DEFAULT 0
                        )''')
    print("Database initialized")

@app.route('/')
def index():
    with sqlite3.connect('tasks.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM tasks ORDER BY id DESC')
        tasks = cursor.fetchall()
    return render_template('index.html', tasks=tasks)

@app.route('/add', methods=['POST'])
def add_task():
    content = request.form['content']
    timestamp = datetime.now().strftime("%b %d, %Y at %I:%M %p")
    with sqlite3.connect('tasks.db') as conn:
        conn.execute('INSERT INTO tasks (content, timestamp) VALUES (?, ?)', (content, timestamp))
    return redirect('/')

@app.route('/complete/<int:task_id>', methods=['POST'])
def complete_task(task_id):
    with sqlite3.connect('tasks.db') as conn:
        conn.execute('UPDATE tasks SET completed = 1 WHERE id = ?', (task_id,))
    return jsonify({"success": True})

@app.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    with sqlite3.connect('tasks.db') as conn:
        conn.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    return jsonify({"success": True})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
