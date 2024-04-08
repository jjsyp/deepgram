from utils.database import get_db
from sqlalchemy import text

def create_tag_list():
    engine = get_db()

    try:
        with engine.connect() as connection:
            result_proxy = connection.execute(text("SELECT tag FROM tags"))
            modellist = [row[0] for row in result_proxy.fetchall()] 

            return modellist

    except Exception as error:
        print("Error:", error)




    