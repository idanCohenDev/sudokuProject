# sudokuProject

This sudoku project was made as part of a Full-Stack web development course i attended and it was my first fully functional project.

Technologies used: Javascript, HTML, CSS, Axios, Fetch API.

Landing page: 

![landingPage](https://user-images.githubusercontent.com/97622278/181904705-3ad02ca9-56eb-42f4-9fa1-848bc456b6ee.png)

In the landing page you need to enter your name in order to interact with the "Current Best" feature which save the player's name and time in the "localStorage" and displayes the fastest player on a particular client.

Login page: 


![loginPage](https://user-images.githubusercontent.com/97622278/181904771-1ba6d6db-e3fc-4068-a9e6-b4d6e005a1ed.png)

In order to play the game a user need to enter the username "abcd" and "1234" for the password.

Difficulty selection: 

![difficultySelection](https://user-images.githubusercontent.com/97622278/181904807-06231c7f-c8c6-406e-a196-34e5a5e106a5.png)

In the difficulty selection a user can choose between 3 levels of difficulty each determains an amount of blank squares in the game and hence increases the difficulty.

Game screen: 

![gameScreen](https://user-images.githubusercontent.com/97622278/181904856-17e40ab3-aeaa-4e38-8032-5269af979267.png)

The game game screen displayes a random suduko matrix which is fetched from a rapid API. 
When the user focused on a quare the game highlights the row, column and the box it's in for a better user experience. 

![numberSelection](https://user-images.githubusercontent.com/97622278/181904935-fccef156-b8d3-4f8e-b898-407bc6d278d4.png)

When the user pressed on a number the game highlights all the numbers of the same value for a better gaming experience.

![combinedGameFeatures](https://user-images.githubusercontent.com/97622278/181904975-8a53edec-b421-48fd-94d8-cc1096850a05.png)

The two features work together even for a number the user already entered.

![mistakesIndicator](https://user-images.githubusercontent.com/97622278/181905007-4c6b6d6b-ce6f-42c7-9351-95b7e1a1a203.png)

When the user pressed the "Finish" button two animations can appear. 
The first animation (last picture) colors the wrong or unfilled squares to display wrong answers to the user. 
The second animation shows the user enterd all the correct numbers by highlighing the the board with a green color.

![gameFinishSucuess](https://user-images.githubusercontent.com/97622278/181905111-b376fdcd-8cf1-48c0-8332-27b5cb292ff9.png)

After the animation the user is displayed with a modal that shows his time and a try again button which returns the user to the difficulty selection page.

![gameSucussModal](https://user-images.githubusercontent.com/97622278/181905157-4f068782-784c-4f46-90cb-9734ef25eb1c.png)

If a user would like to restart the current game with the same difficulty a "Reset" button was added. 
The "Reset" button opens a modal which ask the user either to refresh and clean all the user inputs or stay in the current game with all the already enterd numbers.

![resetFeature](https://user-images.githubusercontent.com/97622278/181905266-06aea5f8-2027-4533-8e13-097b34e3448c.png)

Extra features: 

The game has full support of a dark mode and a nice calm music to listen to while playing. 

![darkModeArrows](https://user-images.githubusercontent.com/97622278/181905308-ea577600-b2c1-42b6-8b82-11c0803b4bfc.png)

Notes: 

The game is fully responsive and works on every screen size.





