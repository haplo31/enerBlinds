
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

String readString;

Servo servOrient;
int orient = 0;
void setup() {
  Serial.begin(9600);
  pinMode(onSwitch,OUTPUT);
  pinMode(ampSwitch, OUTPUT);
  digitalWrite(onSwitch, HIGH);
  digitalWrite(ampSwitch, HIGH);
  servOrient.attach(9);
}

void loop()
{
	 while (Serial.available()) {
    delay(3);  
    char c = Serial.read();
    readString += c; 
  }
  readString.trim();
  if (readString.length() >0) {
    if (readString == "getPower"){
      Serial.println("launch function");
      getPower();
    }
""
    readString="";
  } 
  
}

void getPower(){
	Serial.println("Activating...");
	digitalWrite(onSwitch, LOW);
        delay(2000);
	Serial.println("Measure Voltage");
	readVolts = analogRead(voltPin);
	Serial.println(readVolts);
	voltageFactor = 1024 / maxVolts;
  voltage = readVolts / voltageFactor;
	Serial.print(voltage);
  Serial.println("V");
  if (voltage>0){
        delay(2000);
        Serial.println("Measure Current");
  	digitalWrite(ampSwitch, LOW);
  	readAmps = analogRead(ampPin);
  	current = readAmps;
    power = voltage * current;
    Serial.print(current);
    Serial.println("mA");
    Serial.print(power);
    Serial.println("mW");    
    delay(500);
    digitalWrite(onSwitch, HIGH);
    digitalWrite(ampSwitch, HIGH);
    delay(500);
  }
  else{
  	Serial.println("Voltage measurement equal to zero, check wiring");
  	digitalWrite(onSwitch, HIGH);
  } 
}
void getLocalOptimum(){
	int actualPos=servOrient.read();
	int powerPlus, powerMoins;
	bool notFind = true;
	Serial.println("Testing proximity values...");
	//Check actual position +10 degrees
	servOrient.write(bestPos+10);
	delay(1000);
	digitalWrite(onSwitch, LOW);
  delay(2000);
	readVolts = analogRead(voltPin);
	voltageFactor = 1024 / maxVolts;
  voltage = readVolts / voltageFactor;
  if (voltage>0){
    delay(2000);
  	digitalWrite(ampSwitch, LOW);
  	readAmps = analogRead(ampPin);
  	current = readAmps;
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
  servOrient.write(bestPos-10);
	delay(1000);
	digitalWrite(onSwitch, LOW);
  delay(2000);
	readVolts = analogRead(voltPin);
	voltageFactor = 1024 / maxVolts;
  voltage = readVolts / voltageFactor;
  if (voltage>0){
    delay(2000);
  	digitalWrite(ampSwitch, LOW);
  	readAmps = analogRead(ampPin);
  	current = readAmps;
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
			  if (voltage>0){
			    delay(2000);
			  	digitalWrite(ampSwitch, LOW);
			  	readAmps = analogRead(ampPin);
			  	current = readAmps;
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
			  	Serial.println("Optimum Find !");
			  	Serial.print("Best angle: ");
  				Serial.println(actualPos+10);
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
			  if (voltage>0){
			    delay(2000);
			  	digitalWrite(ampSwitch, LOW);
			  	readAmps = analogRead(ampPin);
			  	current = readAmps;
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
			  	Serial.println("Optimum Find !");
			  	Serial.print("Best angle: ");
  				Serial.println(actualPos-10);
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
	for (int pos = 0; pos <= 180; pos += 15) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    servOrient.write(pos);              // tell servo to go to position in variable 'pos'
    delay(1000);
		digitalWrite(onSwitch, LOW);
	  delay(2000);
		readVolts = analogRead(voltPin);
		voltageFactor = 1024 / maxVolts;
	  voltage = readVolts / voltageFactor;
	  if (voltage>0){
	    delay(2000);
	  	digitalWrite(ampSwitch, LOW);
	  	readAmps = analogRead(ampPin);
	  	current = readAmps;
	    power = voltage * current;
	    Serial.print(current);
	    Serial.print("mW on position ");
			Serial.print(pos);
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
	  	Serial.println("New best position find !");
	  }
  }
  Serial.println("Set position to best");
  Serial.print("Best angle: ");
  Serial.println(bestPos);
  servOrient.write(bestPos); 
}