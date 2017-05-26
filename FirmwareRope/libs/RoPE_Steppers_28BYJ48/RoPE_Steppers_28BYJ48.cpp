#include "Arduino.h"
#include "RoPE_Steppers_28BYJ48.h"
/*
8 = 5,625 Graus
64*8 = 360 Graus

1 0 1 0
0 1 1 0
0 1 0 1
1 0 0 1
*/
#define DELAY_MAX  3

#define MOTOR1_F1  3
#define MOTOR1_F2  5
#define MOTOR1_F3  2
#define MOTOR1_F4  4

#define MOTOR2_F1  7
#define MOTOR2_F2  9
#define MOTOR2_F3  6
#define MOTOR2_F4  8

void private_RoPE_Steppers_28BYJ48_MOTORS_LOW(){
  digitalWrite(MOTOR1_F1, LOW);
  digitalWrite(MOTOR1_F2, LOW);
  digitalWrite(MOTOR1_F3, LOW);
  digitalWrite(MOTOR1_F4, LOW);

  digitalWrite(MOTOR2_F1, LOW);
  digitalWrite(MOTOR2_F2, LOW);
  digitalWrite(MOTOR2_F3, LOW);
  digitalWrite(MOTOR2_F4, LOW);
}

void steppers_setup() {
  pinMode(MOTOR1_F1, OUTPUT);
  pinMode(MOTOR1_F2, OUTPUT);
  pinMode(MOTOR1_F3, OUTPUT);
  pinMode(MOTOR1_F4, OUTPUT);

  pinMode(MOTOR2_F1, OUTPUT);
  pinMode(MOTOR2_F2, OUTPUT);
  pinMode(MOTOR2_F3, OUTPUT);
  pinMode(MOTOR2_F4, OUTPUT);

  private_RoPE_Steppers_28BYJ48_MOTORS_LOW();
}

void private_RoPE_Steppers_28BYJ48_MOTOR1_step_one(){
  digitalWrite(MOTOR1_F1, 1);
  digitalWrite(MOTOR1_F2, 0);
  digitalWrite(MOTOR1_F3, 1);
  digitalWrite(MOTOR1_F4, 0);
}
void private_RoPE_Steppers_28BYJ48_MOTOR1_step_two(){
  digitalWrite(MOTOR1_F1, 0);
  digitalWrite(MOTOR1_F2, 1);
  digitalWrite(MOTOR1_F3, 1);
  digitalWrite(MOTOR1_F4, 0);
}
void private_RoPE_Steppers_28BYJ48_MOTOR1_step_three(){
  digitalWrite(MOTOR1_F1, 0);
  digitalWrite(MOTOR1_F2, 1);
  digitalWrite(MOTOR1_F3, 0);
  digitalWrite(MOTOR1_F4, 1);
}
void private_RoPE_Steppers_28BYJ48_MOTOR1_step_four(){
  digitalWrite(MOTOR1_F1, 1);
  digitalWrite(MOTOR1_F2, 0);
  digitalWrite(MOTOR1_F3, 0);
  digitalWrite(MOTOR1_F4, 1);
}
void private_RoPE_Steppers_28BYJ48_MOTOR2_step_one(){
  digitalWrite(MOTOR2_F1, 1);
  digitalWrite(MOTOR2_F2, 0);
  digitalWrite(MOTOR2_F3, 1);
  digitalWrite(MOTOR2_F4, 0);
}
void private_RoPE_Steppers_28BYJ48_MOTOR2_step_two(){
  digitalWrite(MOTOR2_F1, 0);
  digitalWrite(MOTOR2_F2, 1);
  digitalWrite(MOTOR2_F3, 1);
  digitalWrite(MOTOR2_F4, 0);
}
void private_RoPE_Steppers_28BYJ48_MOTOR2_step_three(){
  digitalWrite(MOTOR2_F1, 0);
  digitalWrite(MOTOR2_F2, 1);
  digitalWrite(MOTOR2_F3, 0);
  digitalWrite(MOTOR2_F4, 1);
}
void private_RoPE_Steppers_28BYJ48_MOTOR2_step_four(){
  digitalWrite(MOTOR2_F1, 1);
  digitalWrite(MOTOR2_F2, 0);
  digitalWrite(MOTOR2_F3, 0);
  digitalWrite(MOTOR2_F4, 1);
}


void motores_frente(bool(*callback)(), int steps = 64*8){
  while(steps > 0 && !(*callback)){
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_one();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_one();
    delay(DELAY_MAX);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_two();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_four();
    delay(DELAY_MAX-1);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_three();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_three();
    delay(DELAY_MAX);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_four();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_two();
    delay(DELAY_MAX-1);
    steps--;
  }
  private_RoPE_Steppers_28BYJ48_MOTORS_LOW();

}

void motores_tras(bool(*callback)(), int steps = 64*8){
  while(steps > 0 && !(*callback)){
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_one();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_one();
    delay(DELAY_MAX);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_four();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_two();
    delay(DELAY_MAX-1);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_three();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_three();
    delay(DELAY_MAX);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_two();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_four();
    delay(DELAY_MAX-1);
    steps--;
  }
  private_RoPE_Steppers_28BYJ48_MOTORS_LOW();
}

void motores_direita(bool(*callback)(), int steps = 64*8){
  while(steps > 0 && !(*callback)){
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_one();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_one();
    delay(DELAY_MAX);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_two();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_two();
    delay(DELAY_MAX-1);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_three();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_three();
    delay(DELAY_MAX);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_four();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_four();
    delay(DELAY_MAX-1);
    steps--;
  }
  private_RoPE_Steppers_28BYJ48_MOTORS_LOW();
}

void motores_esquerda(bool(*callback)(), int steps = 64*8){
  while(steps > 0 && !(*callback)){
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_one();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_one();
    delay(DELAY_MAX);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_four();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_four();
    delay(DELAY_MAX-1);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_three();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_three();
    delay(DELAY_MAX);
    private_RoPE_Steppers_28BYJ48_MOTOR1_step_two();
    private_RoPE_Steppers_28BYJ48_MOTOR2_step_two();
    delay(DELAY_MAX-1);
    steps--;
  }
  private_RoPE_Steppers_28BYJ48_MOTORS_LOW();
}
