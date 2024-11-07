from flask import Flask, render_template, redirect, url_for, flash, session, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Email, ValidationError
from flask_wtf import FlaskForm
from flask_cors import CORS
import bcrypt
from datetime import timedelta

app = Flask(__name__, static_url_path='/static')

CORS(app)

app.secret_key = 'secretKey'
app.permanent_session_lifetime = timedelta(minutes=60)
app.config["MONGO_URI"] = "mongodb+srv://harshitvishwakarma007:HarshitWithNoSpecialCharacter@cluster1.22i9t1u.mongodb.net/Python"

# Initialize PyMongo and connect to the database
mongo = PyMongo(app)

# Check the database connection
try:
    # Ping the database to ensure the connection is established
    mongo.cx.admin.command('ping')
    print("Connected to MongoDB!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    exit(1)  # Exit if the database connection fails

db = mongo.db.users


def find_user(email, password):
    user = db.find_one({'email': email})
    if user and bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        return user['_id']
    return None


class SignupForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField('Signup')

    def validate_email(self, field):
        user = db.find_one({"email": field.data})
        if user:
            raise ValidationError('Email already in use')


class LoginForm(FlaskForm):
    email = StringField("Email", validators=[Email(), DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField('login')


@app.route("/", methods=["POST", "GET"])
def index():
    if 'user_id' in session:
        return render_template('home2.html')
    return redirect(url_for('login'))


@app.route('/signup', methods=["POST", "GET"])
def signup():
    form = SignupForm()

    if 'user_id' in session:
        session.clear()

    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        password = form.password.data

        hashed_pass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        inserted_user = db.insert_one({"name": name, "email": email, "password": hashed_pass})

        if inserted_user:
            print('User inserted')
        else:
            print('Failed to create user')

        return redirect(url_for('login'))

    print('Signup failed')
    return render_template('signup2.html', form=form)


@app.route("/login", methods=["POST", "GET"])
def login():
    if 'user_id' in session:
        return redirect(url_for('index'))

    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data

        user_id = find_user(email=email, password=password)
        if user_id is None:
            print('Failed to connect with database')
            return redirect(url_for('login'))

        session['user_id'] = str(user_id)
        return redirect(url_for('index'))

    print('User not validating')
    return render_template('login2.html', form=form)


@app.route("/logout", methods=["GET", "POST"])
def logout():
    if 'user_id' in session:
        session.clear()
        return redirect(url_for('login'))
    return redirect(url_for('login'))


@app.route("/saveGame", methods=["POST", "GET"])
def saveGame():
    data = request.get_json()
    print(data)

    if 'user_id' in session:
        user_id = ObjectId(session['user_id'])
        try:
            user_update = db.update_one({'_id': user_id}, {"$push": {'history': data}})
            if user_update.modified_count == 1:
                return redirect(url_for('index'))
            print('Module not updated')
            return redirect(url_for('index'))
        except Exception as e:
            print(e)

    return redirect(url_for('index'))


# Game Routes -------------------------------------------------

@app.route("/alphabetSeriation")
def serielizeTheAlphabets():
    if 'user_id' in session:
        return render_template('serielizeTheAlphabets.html')
    else:
        return redirect(url_for('login'))


@app.route("/spellMingle")
def letterMaster():
    if 'user_id' in session:
        return render_template('letterMaster.html')
    else:
        return redirect(url_for('login'))


@app.route("/counting")
def countTheFruits():
    if 'user_id' in session:
        return render_template('appleCount.html')
    else:
        return redirect(url_for('login'))


@app.route("/numberSeriation")
def serielizeTheNumbers():
    if 'user_id' in session:
        return render_template('seriealizeNumber.html')
    else:
        return redirect(url_for('login'))


@app.route("/memoryFlip")
def flipTheCards():
    if 'user_id' in session:
        return render_template('flipTheCards.html')
    else:
        return redirect(url_for('login'))


@app.route("/memoryCards")
def memoryCards():
    if 'user_id' in session:
        return render_template('memoryCards.html')
    else:
        return redirect(url_for('login'))


@app.route("/userProfile")
def userProfile():
    if 'user_id' in session:
        user_id = ObjectId(session['user_id'])
        print('User ID is in session')
        user = db.find_one({'_id': user_id})
        print(user)
        return render_template('userProfile2.html', user=user)
    else:
        return redirect(url_for('login'))


if __name__ == "__main__":
    # Run the app after confirming the database connection
    app.run(port=3000, threaded=True, debug=True)
