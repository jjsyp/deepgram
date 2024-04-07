import psycopg2
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv


def create_database_engine(dbname, user, password, host, port):
    print(dbname, user, password, host, port)
    engine = create_engine(f'postgresql://{user}:{password}@{host}:{port}/{dbname}')
    print('Engine for PostgreSQL database created.')
    return engine


#funciton to send data to the database using the existing connection
def send_to_database(engine, data_objects):
    try:
        #do not created connection here, connection = engine.connect() is used as the connection
        with engine.connect() as connection:
            #create a cursor to interact with the database
            trans = connection.begin()
            # if the data_objects is not a list, make it a list
            if not isinstance(data_objects, list):
                data_objects = [data_objects]

            #for each data object in the list
            for data in data_objects:
                
                # Check if model already exists
                result = connection.execute(text("SELECT id FROM audio WHERE model=:model AND language=:language AND tier=:tier AND text=:text"),
                                            {'model': data.model, 'language': data.language, 'tier': data.tier, 'text': data.text}).fetchone()
                print('Result:', result)

                # If result is not null, skip this insert statement
                if result is None:
                    # Store a record in the audio table
                    connection.execute(text("INSERT INTO audio (model, language, tier, text, audiofile) VALUES (:model, :language, :tier, :text, :audiofile)"),
                                       {'model': data.model, 'language': data.language, 'tier': data.tier, 'text': data.text, 'audiofile': data.audiofile})
                
                result = connection.execute(text("SELECT id FROM audio WHERE model=:model AND language=:language AND tier=:tier AND text=:text"),
                                            {'model': data.model, 'language': data.language, 'tier': data.tier, 'text': data.text}).fetchone()
                audioid = result[0]
                print('Result:', result)

                # Store a record in the tagging table
                connection.execute(text("INSERT INTO tagging (email, audioid, tags, score, quantifier) VALUES (:email, :audioid, :tags, :score, :quantifier)"),
                               {'email': data.email, 'audioid': audioid, 'tags': data.tags, 'score': data.score, 'quantifier': data.quantifier})
            
            trans.commit()
            print("Data inserted successfully!")
        
    #handle any errors that occur during the database connection
    except Exception as error:
        print("Error:", error)

