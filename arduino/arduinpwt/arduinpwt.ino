#include <Servo.h>


int voltPin = 1;
int ampPin = 2;
int readVolts = 0;
int readAmps = 0;
int maxVolts = 20; //Must match voltage circuit resistors
float voltageFactor = 0;
float voltage = 0;
float current = 0;
float power = 0;

int onSwitch=3;
int ampSwitch=4;
int actualPos=0;
String message;
Servo servOrient;
int orient = 0;
void setup() {
  Serial.begin(9600);
  pinMode(onSwitch,OUTPUT);
  pinMode(ampSwitch, OUTPUT);
  digitalWrite(onSwitch, HIGH);
  digitalWrite(ampSwitch, HIGH);
  servOrient.attach(9);
  delay(500);
  servOrient.write(0);
}
String inByte;
void loop()
{
  if (Serial.available() > 0) {
    // get incoming byte:
    inByte = Serial.readString();
    if (inByte=="RTM"){
      //Serial.println("RTM: 15.10V 07.00A");
      message="RTM: ";
      getPower();    
    }
    else if( inByte=="APM"){
      //Serial.println("APM: 15.10V 07.00A");
      message="APM: ";
      getPower();
    }
    else if( inByte=="LOP"){
      getLocalOptimum();
    }
    else if( inByte=="GOP"){
      getGlobalOptimum();
    }
    else if( inByte=="BUP"){
      blindUp();
    }
    else if( inByte=="BDO"){
      blindDown();
    }
  }  
}

void getPower(){
	Serial.println("Activating...");
	digitalWrite(onSwitch, LOW);
  delay(2000);
	Serial.println("Measure Voltage");

	readVolts = analogRead(voltPin);
	voltageFactor = 1024 / maxVolts;
  voltage = readVolts / voltageFactor;
  //voltage = random(15,25);
	Serial.print(voltage);
  Serial.println("V");
  if (voltage>0){
    delay(2000);
    Serial.println("Measure Current");
  	digitalWrite(ampSwitch, LOW);
  	readAmps = analogRead(ampPin);
  	current = readAmps/1000*4;
        //current = random(1,4);
  	Serial.print(message);
   	if (voltage<10){
   		Serial.print("0");
   		Serial.print(voltage,2);
   	}
   	else{
   		Serial.print(voltage,2);
   	}
   	Serial.print("V ");
   	if (current<10){
   		Serial.print("0");
   		Serial.print(current,2);
   	}
   	else{
   		Serial.print(current,2);
   	} 
    Serial.println("A");   
    delay(500);
    digitalWrite(onSwitch, HIGH);
    digitalWrite(ampSwitch, HIGH);
    delay(500);
    Serial.println("Movement finished"); 
  }
  else{
  	Serial.println("Voltage measurement equal to zero, check wiring");
        Serial.println("Movement finished"); 
  	digitalWrite(onSwitch, HIGH);
  } 
}
void getLocalOptimum(){
	actualPos=servOrient.read();
	int powerPlus, powerMoins;
	bool notFind = true;
	Serial.println("Testing proximity values...");
	//Check actual position +10 degrees
	servOrient.write(actualPos+10);
	delay(1000);
	digitalWrite(onSwitch, LOW);
  delay(2000);
	readVolts = analogRead(voltPin);
	voltageFactor = 1024 / maxVolts;
  voltage = readVolts / voltageFactor;
  //voltage = random(15,25);
  if (voltage>0){
    delay(2000);
  	digitalWrite(ampSwitch, LOW);
  	readAmps = analogRead(ampPin);
  	current = readAmps/1000*4;
    //current = random(1,4);
    power = voltage * current;
    delay(500);
    digitalWrite(onSwitch, HIGH);
    digitalWrite(ampSwitch, HIGH);
    delay(500);
  }
  else{
  	digitalWrite(onSwitch, HIGH);
  	power=0;
  }	
  powerPlus=power;
  //Check actual position -10 degrees
  servOrient.write(actualPos-10);
	delay(1000);
	digitalWrite(onSwitch, LOW);
  delay(2000);
	readVolts = analogRead(voltPin);
	voltageFactor = 1024 / maxVolts;
  voltage = readVolts / voltageFactor;
  //voltage = random(15,25);
  if (voltage>0){
    delay(2000);
  	digitalWrite(ampSwitch, LOW);
  	readAmps = analogRead(ampPin);
  	current = readAmps/1000*4;
    //current = random(1,4);
    power = voltage * current;
    delay(500);
    digitalWrite(onSwitch, HIGH);
    digitalWrite(ampSwitch, HIGH);
    delay(500);
  }
  else{
  	digitalWrite(onSwitch, HIGH);
  	power=0;
  }
  powerMoins=power;
  Serial.println("Side found ! Searching Optimum...");
  //One direction
  if (powerMoins>powerPlus){
  	//Move while power is increasing
  	while(notFind){
  	    actualPos=actualPos-10;
  	    servOrient.write(actualPos);
				delay(1000);
				digitalWrite(onSwitch, LOW);
			  delay(2000);
				readVolts = analogRead(voltPin);
				voltageFactor = 1024 / maxVolts;
			  voltage = readVolts / voltageFactor;
        //voltage = random(15,25);
			  if (voltage>0){
			    delay(2000);
			  	digitalWrite(ampSwitch, LOW);
			  	readAmps = analogRead(ampPin);
			  	current = readAmps/1000*4;
          //current = random(1,4);
			    power = voltage * current;
			    delay(500);
			    digitalWrite(onSwitch, HIGH);
			    digitalWrite(ampSwitch, HIGH);
			    delay(500);
			  }
			  else{
			  	digitalWrite(onSwitch, HIGH);
			  	power=0;
			  }
			  //If power decreases, go back to last position else continue
			  if (power<powerMoins){
			  	notFind=false;
			  	servOrient.write(actualPos+10);
			  	Serial.println("Optimum Found !");
			  	Serial.print("Best angle: ");
  				Serial.println(actualPos+10);
                                Serial.println("Movement finished"); 
			  }
			  else{
			  	powerMoins=power;
			  }
  	}
  }
  // Other Direction
  else{
  	while(notFind){
  	    actualPos=actualPos+10;
  	    servOrient.write(actualPos);
				delay(1000);
				digitalWrite(onSwitch, LOW);
			  delay(2000);
				readVolts = analogRead(voltPin);
				voltageFactor = 1024 / maxVolts;
			  voltage = readVolts / voltageFactor;
        //voltage = random(15,25);
			  if (voltage>0){
			    delay(2000);
			  	digitalWrite(ampSwitch, LOW);
			  	readAmps = analogRead(ampPin);
			  	current = readAmps/1000*4;
          //current = random(1,4);
			    power = voltage * current;
			    delay(500);
			    digitalWrite(onSwitch, HIGH);
			    digitalWrite(ampSwitch, HIGH);
			    delay(500);
			  }
			  else{
			  	digitalWrite(onSwitch, HIGH);
			  	power=0;
			  }
			  //If power decreases, go back to last position else continue
			  if (power<powerPlus){
			  	notFind=false;
			  	servOrient.write(actualPos-10);
			  	Serial.println("Optimum Found !");
			  	Serial.print("Best angle: ");
  				Serial.println(actualPos-10);
                                Serial.println("Movement finished"); 
			  }
			  else{
			  	powerPlus=power;
			  }
  	}  	
  }
}
void getGlobalOptimum(){
	int bestPos=0;
	int powerBestPos=0;
	for (int pos = 0; pos <= 90; pos += 10) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    servOrient.write(pos);              // tell servo to go to position in variable 'pos'
    delay(1000);
		digitalWrite(onSwitch, LOW);
	  delay(2000);
		readVolts = analogRead(voltPin);
		voltageFactor = 1024 / maxVolts;
	  voltage = readVolts / voltageFactor;
    //voltage = random(15,25);
	  if (voltage>0){
	    delay(2000);
	  	digitalWrite(ampSwitch, LOW);
	  	readAmps = analogRead(ampPin);
	  	current = readAmps/1000*4;
      //current = random(1,4);
	    power = voltage * current;
	    Serial.print(power);
	    Serial.print("mW on position ");
			Serial.println(pos);
	    delay(500);
	    digitalWrite(onSwitch, HIGH);
	    digitalWrite(ampSwitch, HIGH);
	    delay(500);
	  }
	  else{
	  	digitalWrite(onSwitch, HIGH);
	  	power=0;
	  }
	  if (power>powerBestPos){
	  	bestPos=pos;
      powerBestPos=power;
	  	Serial.println("New best position found !");
	  }
  }
  Serial.println("Set position to best");
  Serial.print("Best angle: ");
  Serial.println(bestPos);
  servOrient.write(bestPos);
  Serial.println("Movement finished"); 
}
void blindUp(){
  actualPos=servOrient.read();
  if(actualPos>=180){
    Serial.println("Already in max pos");
    Serial.println("Movement finished");
  }
  else{
      actualPos+=30;
      Serial.print("Set angle: ");
      Serial.println(actualPos);
      servOrient.write(actualPos);
      Serial.println("Movement finished");    
  }

}
void blindDown(){
  actualPos=servOrient.read();
  if(actualPos<=0){
    Serial.println("Already in min pos");
    Serial.println("Movement finished");
  }
  else{
      actualPos-=30;
      Serial.print("Set angle: ");
      Serial.println(actualPos);
      servOrient.write(actualPos);
      Serial.println("Movement finished");     
  }
}
