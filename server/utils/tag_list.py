from utils.database import get_db

tag_list = [
    "Good",
    "Bad",
    "Dumb",
    "How can you hear this?",
    "What's wrong with you?",
    "I hate you."
]

def get_tag_list():
    engine = get_db()

    try:
        #do not created connection here, connection = engine.connect() is used as the connection
        with engine.connect() as connection:
            #create a cursor to interact with the database
            trans = connection.begin()

            #get a list of all tags from db
            connection.execute("SELECT * FROM tags;")
            taglist = connection.fetchall()

            return taglist


            #handle any errors that occur during the database connection
    except Exception as error:
        print("Error:", error)




    