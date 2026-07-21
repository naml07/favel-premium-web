import subprocess

try:
    result = subprocess.run(['git', 'status'], capture_output=True, text=True)
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
except Exception as e:
    print("ERROR:", str(e))
