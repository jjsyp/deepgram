#user class:
#stores user id based of the flask session id and saves data objects to a dictionary instance variable

class User:
    def __init__(self, user_id, email):
        self.user_id = user_id
        self.data = {}
        self.email = email

    def add_data(self, key, value):
        self.data[key] = value

    def get_data(self, key):
        return self.data.get(key)
    
    