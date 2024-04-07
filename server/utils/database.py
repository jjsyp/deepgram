import psycopg2
from models.model_data import ModelData

def send_to_database(dbname, user, password, host, port, data_objects):
    connection = None
    try:
        connection = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )

        print('Connecting to the PostgreSQL database...')
        cursor = connection.cursor()

        print(type(data_objects.audiofile))
        if not isinstance(data_objects, list):
            data_objects = [data_objects]
        
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
                               (data.model, data.language, data.tier, data.text, psycopg2.Binary(data.audiofile)))

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

    except(Exception, psycopg2.DatabaseError) as error:
        print("Error:", error)
    finally:
        if connection is not None:
            connection.close()
            print('Database connection terminated.')
