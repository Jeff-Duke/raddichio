# Radicchio
Radicchio is an automated garden watering system.  It is a collection of components meant to work together to form the hardware system, the back-end and the front-end interfaces.  The system checks the moisture level reported back by the soil moisture sensor and turns on the water when it gets too dry.  

## Hardware
The project is built using the [Tessel-2](https://tessel.io/) microcontroller which is running [Johnny-Five js](http://johnny-five.io/).  The microcontroller is also running a NodeJS server using Express.  This server is pushing sensor data to the cloud via the Sparkfun Phant.io service.  This gives us a web-based dashboard for viewing trends with our system such as temperatures, humidity levels and watering intervals.  The Node server is also serving a local control interface that is accessible when the client is on the same network as the microcontroller.  This is providing real-time sensor information as well as manual controls via Socket.io.
![fritzing diagram](https://github.com/Jeff-Duke/radicchio/blob/master/radicchio/public/Screen%20Shot%202016-11-05%20at%2013.11.25.png "Fritzing Diagram of the hardware")

![demo of system using a servo to mock the valve](http://g.recordit.co/kspOwKPLDd.gif)

## Web-based Interface
The web dashboard is built in React and uses the Chart.js library for charting data gathered from the sensors on the hardware. ![Web Dashboard](https://github.com/Jeff-Duke/radicchio/blob/master/radicchio/public/Screen%20Shot%202016-11-08%20at%2013.37.31.png "Web Dashboard")

## Local Interface
The local interface is also bulit in React.  It uses Just-Gage for displaying information from the sensors. The design is responsive and mobile first so it's easy to use from your smart-phone. 
![Local Interface](https://github.com/Jeff-Duke/radicchio/blob/master/radicchio/public/mobile-screenshot.png "Local Interface")

## Running the project yourself
The project is written for the Tessel-2 and, as such, requires that the microcontroller have wifi and be running Node.  If you're not using the Tessel-2, that's ok, you'll just need to make some abstractions to the code and you might have to tether your microcontroller to another system that can run the Node server.  

The johnny-five file that controls the hardware is `/radicchio-local.js`.
The local interface is served from `/app`.
The web-interface is in the `/radicchio` folder.

