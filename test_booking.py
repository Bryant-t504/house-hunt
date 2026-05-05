import urllib.request
import urllib.parse
import json
import datetime

base_url = 'http://127.0.0.1:8000/api'

def fetch(url, data=None, headers=None, method='POST'):
    req_headers = {'Content-Type': 'application/json'}
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, headers=req_headers, method=method)
    if data is not None:
        req.data = json.dumps(data).encode('utf-8')
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

# 1. Register a new tenant
username = 'testtenant1234'
password = 'Password123!'
print("Registering...")
status, res = fetch(f'{base_url}/auth/register/', data={
    'username': username,
    'password': password,
    'password_confirm': password,
    'email': 'testtenant1234@example.com',
    'role': 'TENANT'
})
print("Register response:", status, res)

# 2. Login
print("Logging in...")
status, res = fetch(f'{base_url}/auth/login/', data={
    'username': username,
    'password': password
})
print("Login response:", status, res)
token = res.get('access')

# 3. Create a property or get existing
status, properties = fetch(f'{base_url}/properties/', method='GET')
if 'results' in properties:
    properties = properties['results']

if not properties:
    print("No properties available to book.")
else:
    prop_id = properties[0]['id']
    print(f"Booking property {prop_id}...")
    headers = {'Authorization': f'Bearer {token}'}
    future_date = (datetime.datetime.now() + datetime.timedelta(days=2)).strftime('%Y-%m-%dT%H:%M')
    status, res = fetch(f'{base_url}/bookings/', data={
        'property': prop_id,
        'preferred_date': future_date,
        'message': 'Testing booking'
    }, headers=headers)
    print("Booking response:", status, res)
