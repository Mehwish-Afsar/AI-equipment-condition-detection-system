from db import get_connection, init_db

equipment_data = [
    ("LAB-PC-021", "Computer", "Computer", "Lab 3", "Damaged", "Under Maintenance", "2026-08-22", "https://images.pexels.com/photos/776615/pexels-photo-776615.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("LAB-PC-022", "Computer", "Computer", "Lab 3", "Normal", "Active", "2026-08-20", "https://images.pexels.com/photos/776615/pexels-photo-776615.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("PJ-012", "Projector", "Projector", "Lab 2", "Normal", "Active", "2026-08-18", "https://images.pexels.com/photos/274973/pexels-photo-274973.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("PJ-014", "Projector", "Projector", "Lecture Hall A", "Damaged", "Under Maintenance", "2026-08-15", "https://images.pexels.com/photos/274973/pexels-photo-274973.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("CH-103", "Chair", "Furniture", "Lab 1", "Damaged", "Inactive", "2026-08-12", "https://images.pexels.com/photos/2762267/pexels-photo-2762267.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("CH-104", "Chair", "Furniture", "Lab 1", "Normal", "Active", "2026-08-10", "https://images.pexels.com/photos/2762267/pexels-photo-2762267.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("DS-205", "Desk", "Furniture", "Lab 4", "Normal", "Active", "2026-08-08", "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("DS-206", "Desk", "Furniture", "Lab 4", "Damaged", "Under Maintenance", "2026-08-05", "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("MN-301", "Monitor", "Monitor", "Lab 3", "Normal", "Active", "2026-08-19", "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("MN-302", "Monitor", "Monitor", "Lab 2", "Uncertain", "Active", "2026-08-21", "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("LAB-PC-023", "Computer", "Computer", "Lab 1", "Normal", "Active", "2026-08-17", "https://images.pexels.com/photos/776615/pexels-photo-776615.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("LAB-PC-024", "Computer", "Computer", "Lab 2", "Damaged", "Under Maintenance", "2026-08-14", "https://images.pexels.com/photos/776615/pexels-photo-776615.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("PJ-015", "Projector", "Projector", "Lab 1", "Normal", "Active", "2026-08-11", "https://images.pexels.com/photos/274973/pexels-photo-274973.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("CH-105", "Chair", "Furniture", "Lecture Hall B", "Normal", "Active", "2026-08-09", "https://images.pexels.com/photos/2762267/pexels-photo-2762267.jpeg?auto=compress&cs=tinysrgb&w=400"),
    ("MN-303", "Monitor", "Monitor", "Lab 4", "Normal", "Active", "2026-08-06", "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=400"),
]

init_db()
conn = get_connection()
for row in equipment_data:
    conn.execute(
        "INSERT OR IGNORE INTO equipment (id, name, category, location, condition, status, last_inspection, image) VALUES (?,?,?,?,?,?,?,?)",
        row
    )
conn.commit()
conn.close()
print(f"Seeded {len(equipment_data)} equipment records.")