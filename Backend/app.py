from flask import Flask, redirect, url_for, jsonify, request
from flask_cors import cross_origin, CORS
from decorator import token_required
from flask_sqlalchemy import SQLAlchemy
import stripe


app = Flask(__name__)

stripe.api_key = 'sk_test_51ORgHTSEwGxLhH4WMnXViUrwcPDxN6N9p00axdYfpvRtolc0MMwAMsndeNQ9pCDTKghjZRX00zeEw3TKIEpatW8e00s5z3bEAE'


app.config['SECRET_KEY'] = 'lash4fdfjn..@#$@df'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'  # Use SQLite for simplicity
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

app.app_context().push()

class TODO(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    title = db.Column(db.String(120),  nullable=False)
    desc = db.Column(db.String(120), nullable=False)
    sno = db.Column(db.Integer)

    def to_json(self):
        return {
            'id' : self.id,
            'username' : self.username,
            'title' : self.title,
            'desc': self.desc,
            'sno' : self.sno,
        }

    def __repr__(self):
        return f"User('{self.username}','{self.sno}', '{self.title}', '{self.desc}')"
    

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    subscription = db.Column(db.Boolean, default=False)

    def to_json(self):
        return {
            'id' : self.id,
            'username' : self.username,
            'subscription': self.subscription
        }

    def __repr__(self):
        return f"User('{self.username}','{self.subscription}')"

db.create_all()

success = {
    "message": "Success!",
}

failure = {
    "message": "failure!",
}

@app.route('/api/login', methods=['GET'])
@token_required
def hello_world(payload = None):
    return jsonify(success)

@app.route('/')
def active():
    return "Activated"


@app.route('/api/addtodo', methods=['POST'])
@token_required
def addTODO(payload = None):
    data = request.json
    username = payload['preferred_username']
    title = data['title']
    desc = data['desc']
    sno = data['sno']
    todo = TODO(username=username, title=title, desc=desc, sno=sno)
    db.session.add(todo)
    db.session.commit()
    return jsonify(success)


@app.route('/api/gettodo', methods=['GET'])
@token_required
def getTODO(payload = None):
    username = payload['preferred_username']
    # print(payload)
    sortedtodos = TODO.query.filter_by(username=username).order_by(TODO.sno).all()
    jsonlist = [todo.to_json() for todo in sortedtodos]
    user = User.query.filter_by(username=username).first()
    sub = False

    if user:
        sub = user.subscription
        
    data = {'todo': jsonlist, 'subscription': sub}
    return jsonify(data)


@app.route('/api/deltodo', methods=['POST'])
@token_required
def delTODO(payload = None):
    data = request.json
    username = payload['preferred_username']
    sno = data['sno']
    todo = TODO.query.filter_by(username=username, sno = sno).first()

    if todo:
        db.session.delete(todo)
        db.session.commit()
        return jsonify(success)
    else:
        return jsonify(failure)
    
    
@app.route('/api/addsub', methods=['GET'])
@token_required 
def addSubscription(payload = None):
    username = payload['preferred_username']
    user = User(username = username, subscription = True)
    db.session.add(user)
    db.session.commit()
    data = {'message':"Success", 'subscription':True}
    return jsonify(data)


@app.route('/api/pay', methods = ['GET'])
@token_required
def stripePayment(payload = None):
    email = payload['email']
    customer = stripe.Customer.create(
    name=payload['preferred_username'],
    address={
        "line1": "510 Townsend St",
        "postal_code": "98140",
        "city": "San Francisco",
        "state": "CA",
        "country": "US",
    },
    )

    intent = stripe.PaymentIntent.create(
        amount = 50000,
        currency = 'inr',
        receipt_email = email,
        customer = customer,
        description="Software development services",
    )

    return ({'clientSecret': intent['client_secret']})



if __name__ == '__main__':
    app.run(debug=True, port=8000)
