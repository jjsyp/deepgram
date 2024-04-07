import psycopg2
from models.model_data import ModelData

def create_database_connection(dbname, user, password, host, port):
    connection = None
    #attempt to connect to the database
    try:
        print('Connecting to the PostgreSQL database...')
        connection = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
    #if the connection fails, print the error
    except(Exception, psycopg2.DatabaseError) as error:
        print("Error:", error)
    
    #if the connection is successful return the connection
    print('Connected to the PostgreSQL database.')
    return connection

def close_database_connection(connection):
    #close the connection to the database
    connection.close()
    print('Database connection terminated.')
    

def is_open(connection):
    try:
        # create a new cursor
        cur = connection.cursor()
        # execute an SQL command
        cur.execute("SELECT 1")
        # connection is open
        return True
    except (Exception, psycopg2.DatabaseError) as error:
        # connection is not open
        return False

#funciton to send data to the database using the existing connection
def send_to_database(connection, data_objects):
    try:
        #create a cursor to interact with the database
        cursor = connection.cursor()

        #if the data_objects is not a list, make it a list
        if not isinstance(data_objects, list):
            data_objects = [data_objects]
        
        #for each data object in the list
        for data in data_objects:
            # Check if model already exists
            cursor.execute("SELECT id FROM audio WHERE model='%s' AND language='%s' AND tier='%s' AND text='%s'" %
                           (data.model, data.language, data.tier, data.text))
            result = cursor.fetchone()
            print('Result:', result)

            # If result is not null, skip this insert statement
            if result is None:
                # Store a record in the audio table
                cursor.execute("INSERT INTO audio (model, language, tier, text, audiofile) VALUES (%s, %s, %s, %s, %s)",
                               (data.model, data.language, data.tier, data.text, data.audiofile))

            cursor.execute("SELECT id FROM audio WHERE model='%s' AND language='%s' AND tier='%s' AND text='%s'" %
                           (data.model, data.language, data.tier, data.text))
            result = cursor.fetchone()
            audioid = result[0]
            print('Result:', result)

            # Store a record in the tagging table
            cursor.execute("INSERT INTO tagging (email, audioid, tags, score, quantifier) VALUES (%s, %s, %s, %s, %s)",
                           (data.email, audioid, data.tags, data.score, data.quantifier))

        connection.commit()
        print("Data inserted successfully!")
        
    #handle any errors that occur during the database connection
    except(Exception, psycopg2.DatabaseError) as error:
        print("Error:", error)
