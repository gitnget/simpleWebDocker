import random
import json
from typing import List, Dict

# Sample Malaysian first and last names to generate realistic full names
malay_first_names = [
    "Aminah", "Farid", "Siti", "Hafiz", "Nurul", "Azman", "Liyana", "Zulkifli", "Amira", "Faiz"
]
chinese_first_names = [
    "Wei", "Liang", "Mei", "Jun", "Xiao", "Hui", "Jie", "Lin", "Fen", "Ting"
]
indian_first_names = [
    "Arjun", "Priya", "Kumar", "Anita", "Raj", "Deepa", "Vijay", "Nisha", "Ravi", "Sangeeta"
]

malay_last_names = [
    "Bin Abdullah", "Binti Ahmad", "Bin Ismail", "Binti Hassan", "Bin Ali"
]
chinese_last_names = [
    "Tan", "Lim", "Lee", "Wong", "Chong"
]
indian_last_names = [
    "Raj", "Singh", "Nair", "Kumar", "Das"
]

def generate_realistic_name() -> str:
    ethnicity = random.choices(
        population=["Malay", "Chinese", "Indian"],
        weights=[0.5, 0.3, 0.2],  # approximate ethnic proportions in Malaysia
        k=1
    )[0]

    if ethnicity == "Malay":
        first = random.choice(malay_first_names)
        last = random.choice(malay_last_names)
        return f"{first} {last}"
    elif ethnicity == "Chinese":
        last = random.choice(chinese_last_names)
        first = random.choice(chinese_first_names)
        return f"{last} {first}"
    else:  # Indian
        first = random.choice(indian_first_names)
        last = random.choice(indian_last_names)
        return f"{first} {last}"

def generate_student_names(count: int) -> List[str]:
    # Generate a list of realistic Malaysian student names without duplicates
    names = set()
    while len(names) < count:
        names.add(generate_realistic_name())
    return list(names)

def generate_attendance_for_student(min_present=2, max_days=5) -> Dict[str, int]:
    present = random.randint(min_present, max_days)
    remaining = max_days - present
    late = random.randint(0, remaining)
    absent = remaining - late
    return {"PRESENT": present, "LATE": late, "ABSENT": absent}

def generate_weekly_attendance(week_start: str) -> List[Dict]:
    forms = {
        "Tingkatan1": ["1A", "1B", "1C"],
        "Tingkatan2": ["2A", "2B", "2C"],
        "Tingkatan3": ["3A", "3B", "3C"]
    }
    students_per_class = 10
    data = []

    for form, classes in forms.items():
        for class_name in classes:
            student_names = generate_student_names(students_per_class)
            for name in student_names:
                attendance = generate_attendance_for_student()
                record = {
                    "Week Start": week_start,
                    "Form": form,
                    "Class": class_name,
                    "Name": name,
                    **attendance
                }
                data.append(record)
    return data

# Example usage
if __name__ == "__main__":
    attendance_data = generate_weekly_attendance("2025-08-12")
    print(json.dumps(attendance_data, indent=2))
