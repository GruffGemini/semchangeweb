# semchangeweb

## Run with docker
```
sh
git clone https://github.com/lizatukhtina/semchangeweb.git
Place database files to static/data:
eng.db - https://drive.google.com/file/d/1l7ku8mB5kqPwl-E5EQmOxVMg5Ie9Z3To/view?usp=share_link
rus.db - https://drive.google.com/file/d/1wDfkKNoXWJa8ooPjy_p48Ir4C_uBNe98/view?usp=share_link
cd semchangeweb
docker compose up
```

## Run without docker 
macOS/Linux
```sh
git clone https://github.com/lizatukhtina/semchangeweb.git
Place database files to static/data:
eng.db - https://drive.google.com/file/d/1l7ku8mB5kqPwl-E5EQmOxVMg5Ie9Z3To/view?usp=share_link
rus.db - https://drive.google.com/file/d/1wDfkKNoXWJa8ooPjy_p48Ir4C_uBNe98/view?usp=share_link
cd semchangeweb
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
flask --app app --debug run --port 5000
```
Windows 
```sh
git clone https://github.com/lizatukhtina/semchangeweb.git
Place database files to static/data:
eng.db - https://drive.google.com/file/d/1l7ku8mB5kqPwl-E5EQmOxVMg5Ie9Z3To/view?usp=share_link
rus.db - https://drive.google.com/file/d/1wDfkKNoXWJa8ooPjy_p48Ir4C_uBNe98/view?usp=share_link
cd semchangeweb
py -3 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
flask --app app --debug run --port 5000
```
[Flask Docs](https://flask.palletsprojects.com/en/2.2.x/quickstart/#)
