import json
from functools import wraps
import jwt
import requests
from flask import request, abort

def get_keycloakPublicKey():
    url = 'http://localhost:8080/realms/react-realm/'
    response = requests.get(url)
    data = response.json()
    # print(data)
    publicKey = f'-----BEGIN PUBLIC KEY-----\n{data["public_key"]}\n-----END PUBLIC KEY-----'
    return publicKey


def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        # Check if the Authorization header is present in the request
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]

        if not token:
            abort(401, 'Token is missing.')
        
        # print(token)

        try:
            # Replace 'your-keycloak-public-key' with the actual public key from Keycloak
            public_key = get_keycloakPublicKey()
            public_key = public_key.encode('ascii')
            payload = jwt.decode(token, public_key, algorithms='RS256', options = {"verify_aud":False})

            # print(type(request))

            # You can access the decoded token payload using 'payload'
            # For example, you can check user roles, sub, etc.
            # For more details on Keycloak token structure, refer to Keycloak documentation
            return f(payload = payload, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            abort(401, 'Token has expired.')
        except Exception as e:
            print(e)
            abort(401, 'Invalid token.')

    return decorated_function
