from utils.database import get_db

def get_model_list():
    engine = get_db()

    try:
        #do not created connection here, connection = engine.connect() is used as the connection
        with engine.connect() as connection:
            #create a cursor to interact with the database
            cursor = connection.cursor()

            #get a list of all models from db
            cursor.execute("SELECT * FROM models;")
            modellist = connection.fetchall()

            return modellist


            #handle any errors that occur during the database connection
    except Exception as error:
        print("Error:", error)