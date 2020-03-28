# tkinter is the Python standard library which serves as an interface to Tk, a simple toolkit, for building GUI applications using event-driven programming.

# https://python-textbok.readthedocs.io/en/stable/Introduction_to_GUI_Programming.html
# https://docs.python.org/3.7/library/tkinter.html

# FIRST GUI APP WITH WINDOW, LABEL AND TWO BUTTONS
from tkinter import Tk, Label, Button

class MyFirstGUI:
    def __init__(self, master):
        '''
        Initializes the app with a root window, passed to it from the Tk class
        '''
        self.master = master
        master.title("A simple GUI")

        # The wodgets below are not children of the root window above
        self.label = Label(master, text="This is our first GUI!")
        self.label.pack()  # Used to position a widget inside its parent

        self.greet_button = Button(master, text="Greet", command=self.greet)
        self.greet_button.pack()

        self.close_button = Button(master, text="Close", command=master.quit)
        self.close_button.pack()

    def greet(self):
        print("Greetings!")


# Initialize the Tk class to create the root/main app window. An app contains only one root window but can have multiple sub-windows.
root = Tk()

my_gui = MyFirstGUI(root)
root.mainloop()

# Execute this code to see a window with a title, a text label and two buttons – one which prints a message in the console, and one which closes the window.
# The window should have all the normal properties of any other window you encounter in your window manager – you are probably able to drag it around by the titlebar, resize it by dragging the frame, and maximise, minimise or close it using buttons on the titlebar.
# The window manager is the part of your operating system which handles windows. All the widgets inside a window, like buttons and other controls, may look different in every GUI toolkit, but the way that the window frames and title bars look and behave is determined by your window manager and should always stay the same.
