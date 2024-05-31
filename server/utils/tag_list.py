"""
tag_list.py 
===========
contains a function to create a list of tag names retrieved from the database.
"""

from utils.flask_db_context import get_db
from sqlalchemy import text

def create_tag_list():
    """
    Create a list of tag names retrieved from the database.

    It retrieves the current database context and establishes a connection 
    to execute a SQL query "SELECT tag FROM tags". 
    The resultant rows of tag names are then extracted into a list.

    Returns
    -------
    taglist : list
        A list containing the names of the tags if successful. 
        If an exception occurs, the function will print the error and return None.

    Raises
    ------
    Exception
        If any error occurs during database connection or tag retrieval.
    """
    engine = get_db()  

    try:
        with engine.connect() as connection: #establish a connection to the database
            result_proxy = connection.execute(text("SELECT tag FROM tags")) #execute a SQL query to retrieve all tags
            taglist = [row[0] for row in result_proxy.fetchall()]  #extract the tag names from the result proxy

            return taglist

    except Exception as error:
        print("Error:", error)



    