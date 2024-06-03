import os
import time
import shutil

def clear_flask_session_folder():
    """Clears files in flask_session folder that have not been accessed in a set time frame.
    
    Dev Note:
    This function is intended for product on initial launch,  Should the data stored in flask sessions be moved elsewhere
    this funciton should no longer be needed and can be safely removed from in server.py"
    """
    
    folder = 'flask_session'
    print('Clearing session folder...')
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            # Check if file has been accessed in the last hour
            if os.path.isfile(file_path) and os.path.getatime(file_path) < time.time() - 7200:  # 7200 seconds = 2 hours edit this value to change the time frame
                os.unlink(file_path)
            elif os.path.isdir(file_path) and os.path.getatime(file_path) < time.time() - 7200:
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))