# Space-Dash
Game that features position tracking using Posenet. Developed using p5.js and three.js.

Using Posent to track the body using the webcame, the ball on screen can be controlled by tilting your body and by jumping. Avoid the red rings and hit the violet ones for extra points.

![Space Dash main interface](https://raw.githubusercontent.com/slw515/Space-Dash/master/spacedash.png)

# Documentation

Final-Project-Documentation
The motivation for this project is to utilize web technologies today that allow users to be placed into more immersive experience. As a child, I really loved playing the Kinect and Wii because I was able to see my physical movements being mirrored on my television. I find it incredible now that there are so many libraries out there that might allow developers to create these amazing experiences that can be experienced from a laptop or a phone. This is my attempt to use one of these libraries to build a dynamic, interesting game that can be played with just a person's laptop anywhere.

This is a web game that tracks the position of a person in front of the camera to determine the movements of the ball the that is being controlled. The game features Posenet, taking advantage of the library's impressive ability to consistently track parts of a person's body. Leaning to one side or another makes the ball move to the same side that the person is leaning towards. Jumping, which is detected once the shoulder positions are tracked to be above a certain position, causes the ball to jump. The game takes the data from Posenet's processing of the live video and uses p5.js to display this information for the user to see in their live video at the top of the game.

The research that I have done so far has taught me how the ThreeJS library can be used to create simple games, and I now have a solid understanding of the z-dimension so that I might make this game. I have also been experimenting with NodeJS to see how I can create a backend, which I intend to use to hold players' high scores.

The game was inspired by Temple Run and seeks to be styled like a futuristic sci-fi game. The style of the game is heavily inspired by my love for Star Wars and retro space posters. Attached is a working screenshot of the application.

I have done previous projects in p5.js, specifically in making simple games with user controlled objects. Using Three.js will be more challenging to incorporate a third dimension to the gameplay.

I first found out about Posenet after seeing it in a suggested video for a Coding Train video I was watching. I wondered if I could utilize this easy-to-use API to create a web experience game that could be used by anyone with an internet connection and a laptop.

I thought about how a game could properly use motion to create an intuitive and fun experience for users. I immediately thought of the games Temple Run and Subway Surfers, as the players must use their hands to jump over obstacles and evade them by going left or right. So I thought about how players could use their bodies to move left or right, and eventually settled on tilting their bodies to move their character and jumping to have it jump.

I followed Three.js tutorials to understand how to create the game, and overall did not find it all that much more different than Processing or p5.js. It was challenging to understand the z-dimension and how elements like lighting and the camera work in relation to all the objects in the scene. After following a few well-documented tutorials I was able to figure it out. This was probably the most difficult thing about creating this project.

Next I needed to create an interface for p5.js, and followed a Daniel Shiffman tutorial to figure this out. I also made sure that this live feed will be displayed on the screen of the user, and thought it would be fun for people to see themselves moving and playing the game. P5.js allowed me to get coordinates of people’s body parts and I decided to compare a person’s shoulder to their hip to determine side movement. If the value of the shoulder was more to the right/left of their right/left hip, the ball would move to the side that they are tilting to. If the players shoulder points are above a certain level, which they are told would be the level at the beginning, the ball will jump.

I thought that creating rings for people to move through would be an intuitive object because of the game’s setting in space. Initially I started off with just red hoops, which would end the game if hit. However, I realized this was far too challenging for people if there were too many hoops and too boring if there were fewer rings. So I came up with the idea of adding rings that would provide bonus points, to motivate users to move around more to jump through these. I created a dodecahedron because I initially wanted the player to control an asteroid, but could not figure out how to create assets in Three.js. I added the mesh background because I thought it would add more to the futuristic, yet retro feel that I wanted the game to have.

Finally, I set up a back-end using Node.js and Express following a tutorial by Daniel Shiffman. It stores to a database locally. This was probably one of the most challenging parts of this, because I had not done any server-side programming in the past. In the future I would have taken it a step further and hooked it up to Firebase potentially.

For the sound I found a public domain retro music which I play, and when the user hits yellow coins for bonus points, a ding sound plays.

I did user testing on two people. Both shared the opinion that making the ball jump was difficult, having to reach a very high threshold in order to trigger it. I think that this is a problem with me making the game, as I can jump fairly high. Perhaps I should market the game as being a workout rather than one that is casual.

At the showcase, people also said that the jump threshold was way too high. Another problem at the showcase was lighting and the presence of other people in the back. Posenet simply takes an array of people present in the webcam frame and this meant that Posenet would constantly jump between many people, although the person playing was the most prominent.
