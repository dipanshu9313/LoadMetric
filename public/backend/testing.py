from sys import path
path.append("C:\\Program Files\\Microsoft.NET\\ADOMD.NET\\160\\")

from flask import Flask, jsonify
from flask_cors import CORS  # Import the CORS extension

app = Flask(__name__)

# Enable CORS for all routes
# CORS(app)

CORS(app, origins=['http://localhost:3000'],
     methods=['GET', 'POST', 'PUT', 'DELETE'])



# print(path)

from pyadomd import Pyadomd

endpoint = 'powerbi://api.powerbi.com/v1.0/myorg/Sprouts%20EDW%20-%20Test%20Marketing'
modelname = "Marketing Dashboard Dataset"

PowerBIEndpoint = endpoint + ";initial catalog=" + modelname
PowerBILogin = ""
PowerBIPassword = ""
connection_string = "Provider=MSOLAP.8;Data Source=" + PowerBIEndpoint + \
                ";UID=" + PowerBILogin + ";PWD=" + PowerBIPassword


conn_str = connection_string
print(conn_str)
query = """EVALUATE DimWeek"""

with Pyadomd(conn_str) as conn:
    with conn.cursor().execute(query) as cur:
        print(cur.fetchall())


@app.route('/api/data', methods=['GET'])
def get_data():
    data = {'message': str(conn_str)}
    return jsonify(data)

if __name__ == '__main__':
    # Run the Flask app on port 5000 (you can change this to any port you want)
    # app.run(debug=True, port=5000)
    app.run(port=3002)
