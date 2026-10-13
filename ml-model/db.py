import sqlite3
import os
from datetime import datetime

DB_PATH = "equipment.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS equipment (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        condition TEXT NOT NULL,
        status TEXT NOT NULL,
        last_inspection TEXT NOT NULL,
        image TEXT
    );

    CREATE TABLE IF NOT EXISTS inspections (
        id TEXT PRIMARY KEY,
        equipment_id TEXT,
        equipment TEXT NOT NULL,
        image TEXT,
        prediction TEXT NOT NULL,
        confidence REAL NOT NULL,
        inspector TEXT,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        recommendation TEXT
    );

    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        equipment_id TEXT,
        equipment TEXT NOT NULL,
        location TEXT,
        issue TEXT,
        priority TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        condition TEXT NOT NULL,
        confidence REAL NOT NULL,
        inspection_date TEXT NOT NULL,
        maintenance_required INTEGER NOT NULL,
        recommendation TEXT,
        inspector TEXT
    );
    """)
    conn.commit()
    conn.close()

def next_id(prefix, table):
    conn = get_connection()
    row = conn.execute(f"SELECT COUNT(*) as c FROM {table}").fetchone()
    conn.close()
    return f"{prefix}-{datetime.now().year}-{row['c'] + 1:03d}"