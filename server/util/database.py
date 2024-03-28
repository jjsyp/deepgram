import psycopg2
from config import config

def connect():
    connection = None
    try:
        params = config()
        print('Connecting to the postgreSQL database ...')
        connection = psycopg2.connect(**params)

        #create a cursor
        cursor = connection.cursor()
        print('PostgreSQL database version: ')
        cursor.execute('SELECT version()')
        db_version = cursor.fetchone()
        print(db_version)


        #BREAK DOWN DATA OBJECT

        #INSERTING INTO AUDIO TABLE
        #dummy data for audio table
        model = "cowboy"
        tier = "3"
        language = "EN"
        text = "hello"

        #getting the audio file from my desktop
        with open('/Users/dangelorobinson/Desktop/newfile.wav', 'rb') as w:
            wav_data = w.read()
        #storing it as binary data
        BLOB = psycopg2.Binary(wav_data)

        #executing a database insert statement
        cursor.execute("INSERT INTO audio (model, tier, language, text, audiofile)  VALUES (%s,%s,%s,%s,%s)", (model,tier,language,text,BLOB,))

        #INSERTING INTO TAGGING TABLE
        #dummy data for tagging
        email = "user4@gmail.com"
        audioid = 2
        tags = ["loud"]
        score = 3
        quantifier = "overall"


        #executing a database insert statement
        cursor.execute("INSERT INTO tagging (email, audioid, tags, score, quantifier)  VALUES (%s,%s,%s,%s,%s)", (email,audioid,tags,score,quantifier))


        connection.commit()

        print("Data inserted successfully!")

        cursor.close()
    except(Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if connection is not None:
            connection.close()
            print('Database connection terminated.')
if __name__ == "__main__":
    connect()


