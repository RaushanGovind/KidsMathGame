import os
import subprocess

scripts = [
    "append_physics_basics.py",
    "append_electricity.py",
    "append_energy.py",
    "append_magnets.py",
    "append_sound.py",
    "append_heat.py",
    "append_gravity.py",
    "append_simple_machines.py",
    "append_water_cycle.py",
    "append_air_wind.py",
    "append_weather.py",
    "append_earth_globe.py",
    "append_continents.py",
    "append_countries.py",
]

# Set CWD to the project root
project_root = r"c:\Users\R K JHA\OneDrive\Desktop\KidsGame\KidsMathGame"
os.chdir(project_root)

# Path to the data file relative to project root
data_file = 'backend/new_batch_7_data.txt'

# Delete existing data file if it exists to start fresh
if os.path.exists(data_file):
    os.remove(data_file)
else:
    # Ensure backend directory exists
    os.makedirs('backend', exist_ok=True)

for script in scripts:
    script_path = os.path.join('backend', script)
    if os.path.exists(script_path):
        print(f"Running {script_path}...")
        # Run the script with CWD as project root so 'backend/...' paths work
        subprocess.run(["python", script_path], check=True, cwd=project_root)
    else:
        print(f"Script {script_path} not found.")

print(f"Finished generating {data_file}")
