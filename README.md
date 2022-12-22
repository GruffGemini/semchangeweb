# semchangeweb

## Run with docker
```
sh
git clone https://github.com/lizatukhtina/semchangeweb.git
cd semchangeweb
docker compose up
```

## Run without docker 
macOS/Linux
```sh
git clone https://github.com/lizatukhtina/semchangeweb.git
cd semchangeweb
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
flask --app app --debug run --port 5000
```
Windows 
```sh
git clone https://github.com/lizatukhtina/semchangeweb.git
cd semchangeweb
py -3 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
flask --app app --debug run --port 5000
```
[Flask Docs](https://flask.palletsprojects.com/en/2.2.x/quickstart/#)
