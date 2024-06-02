from flask import Flask
from flask import render_template, redirect, url_for, flash, session, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Email, ValidationError
from flask_wtf import FlaskForm
from flask_cors import CORS
import bcrypt
import urllib
from datetime import timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from pymongo.server_api import ServerApi



app = Flask(__name__,static_url_path='/static')


CORS(app)


app.secret_key = 'secretKey'
app.permanent_session_lifetime = timedelta(minutes=60)

app.config["MONGO_URI"] = "mongodb+srv://paldeepesh41:"+urllib.parse.quote("Dipesh@12345")+"@cluster0.4mlnzoe.mongodb.net/kidsgame"


db = None


async def ConnectWithDataBase():
    client = AsyncIOMotorClient(app.config['MONGO_URI'],server_api=ServerApi('1'))
    print('line number 32')
    try:
      await client.admin.command('ping')
      print("Pinged your deployment. You successfully connected to MongoDB!")
      return client['kidsgame']['users']
    except Exception as e:
      print(e)





async def findUser(email, password):
        users = await ConnectWithDataBase()
        user = await users.find_one({'email' : email})

        if user and bcrypt.checkpw(password.encode('utf-8'), user["password"]):
            print(user['_id'])
            return user['_id']
        return None


class SignupForm(FlaskForm) : 
    name = StringField("Name", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField('Signup')

    async def validate_email(self, field):
        users = await ConnectWithDataBase()
        user = users.find_one({"email" : field.data })
        if user is None: 
            raise ValidationError('Email already in use')

class LoginForm(FlaskForm):
    email = StringField("Email",validators=[Email(), DataRequired()])
    password = PasswordField("Password",validators=[DataRequired()])
    submit = SubmitField('login')

# Specify the directory containing your HTML files
# app.config["HTML_DIR"] = "E:\Projects\Dipesh Project\backend"  # Replace with your actual path



@app.route("/", methods = ["post","get"])
async def index():
    # global db 
    # db = await ConnectWithDataBase()
    if 'user_id' in session:
        return render_template('home2.html')
    return redirect(url_for('login'))


@app.route('/signup', methods=["post","get"])
async def signup():
    form = SignupForm()

    if 'user_id' in session:
        session.clear()

    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        password = form.password.data

        hashedPass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        users = await ConnectWithDataBase()
        insertedUser = await users.insert_one({"name" : name, "email": email, "password": hashedPass})
        if insertedUser : 
            print('user inserted')
        else : 
            print('failed to create user')

        return redirect(url_for('login'))
    
    print('singup failed')

    return render_template('signup2.html', form = form)


@app.route("/login", methods=["post","get"])
async def login():
    if 'user_id' in session:
        return redirect(url_for('index'))

    form = LoginForm()
    if form.validate_on_submit():
        print('validation on submit')
        email = form.email.data
        password = form.password.data

        userId = await findUser(email=email, password=password)
        if userId is None:
            print('failed to connect with database')
            return redirect(url_for('login'))

        session['user_id'] = str(userId)


        if 'user_id' in session:
                print('1st level')
                return redirect(url_for('index'))

        
    print('user not validating')
    return render_template('login2.html', form = form)

@app.route("/logout", methods=["get","post"])
def logout():
    if 'user_id' in session:
        session.clear()
        return redirect(url_for('login'))
    return redirect(url_for('login'))


@app.route("/saveGame", methods=["post","get"])
async def saveGame():
        
        data = request.get_json()
        print(data)

    
        if 'user_id' in session : 
            userId = ObjectId(session['user_id'])
            try : 
                users = await ConnectWithDataBase()
                userUpdate =  users.update_one({'_id': userId},{"$push" :{'history': data}})
                if userUpdate.modified_count == 1 :
                    return redirect(url_for('index'))
                print('module not updated')
                return redirect(url_for('index'))
            except Exception as e : 
                print(e)

        return redirect(url_for('index'))

            


# Game Routes -------------------------------------------------
 

# Letters 

@app.route("/alphabetSeriation")
def serielizeTheAlphabets():
    if 'user_id' in session:
        return render_template('serielizeTheAlphabets.html') 
    else : 
        return redirect(url_for('login'))


@app.route("/spellMingle")
def letterMaster():
    if 'user_id' in session : 
        return render_template('letterMaster.html')
    else : 
        return redirect(url_for('login'))



# Counting 

@app.route("/counting")
def countTheFruits():
    if 'user_id' in session:
        return render_template('appleCount.html')
    else : 
        return redirect(url_for('login'))


@app.route("/numberSeriation")
def serielizeTheNumbers():
    if 'user_id' in session:
        return render_template('seriealizeNumber.html')
    else : 
        return redirect(url_for('login'))


# Memory

@app.route("/memoryFlip")
def flipTheCards():
    if 'user_id' in session:
        return render_template('flipTheCards.html')
    else : 
        return redirect(url_for('login'))



@app.route("/memoryCards")
def memoryCards():
    if 'user_id' in session : 
        return render_template('memoryCards.html')
    else : 
        return redirect(url_for('login'))

# User Profile

@app.route("/userProfile")
async def userProfile():
    if 'user_id' in session:
        userId =  ObjectId(session['user_id'])
        print('user id is in sessions')
        print(userId)
        users = await ConnectWithDataBase()
        
        user = await users.find_one({'_id': userId})
        print(user)
        return render_template('userProfile2.html', user=user)
        
    else : 
        return redirect(url_for('login'))
    


if __name__ == "__main__":
    asyncio.run(ConnectWithDataBase())
    app.run(port=3000, threaded = True, debug=True)


