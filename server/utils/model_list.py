from utils.database import get_db
from sqlalchemy import text

def create_model_list():
    engine = get_db()

    try:
        with engine.connect() as connection:
            result_proxy = connection.execute(text("SELECT * FROM models"))
            modellist = result_proxy.fetchall()
            print(modellist)
            return modellist

    except Exception as error:
        print("Error:", error)