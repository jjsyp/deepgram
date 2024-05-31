"""
model_list.py 
=============
contains the function create_model_list() which retrieves the names of the models from the database.
"""

from utils.flask_db_context import get_db
from sqlalchemy import text

def create_model_list():
    """
    Create a list of model names retrieved from the database.

    It retrieves the current database context and establishes a connection 
    to execute a SQL query "SELECT name FROM models". 
    The resultant rows of names are then extracted into a list.

    Returns
    -------
    modellist : list
        A list containing the names of the models if successful. 
        If an exception occurs, the function will print the error and return None.

    Raises
    ------
    Exception
        If any error occurs during database connection or data retrieval.
    """
    engine = get_db()

    try:
        with engine.connect() as connection:
            result_proxy = connection.execute(text("SELECT name FROM models"))
            modellist = [row[0] for row in result_proxy.fetchall()] 

            return modellist

    except Exception as error:
        print("Error:", error)