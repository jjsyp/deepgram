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