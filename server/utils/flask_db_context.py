"""
flask_db_context.py"
====================
Contains functions for getting the current database context.
"""

from flask import g

def get_db():
    """
    Get the current database context.

    Uses flask's `g` object, which is an application context global.
    This means it's a variable which is global to the entire application, that stores data associated with a current request.

    Returns
    -------
    g.db : SQLAlchemy Engine
        Current database context if it was previously assigned, `None` otherwise.
    """
    return g.db