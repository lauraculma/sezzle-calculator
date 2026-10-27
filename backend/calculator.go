package main

import (
	"errors"
	"math"
)

func Calculate(operation string, a, b float64) (float64, error) {
	switch operation {
	case "add", "+", "addition":
		return a + b, nil
	case "subtract", "-", "subtraction":
		return a - b, nil
	case "multiply", "*", "multiplication":
		return a * b, nil
	case "divide", "/", "division":
		if b == 0 {
			return 0, errors.New("division by zero is not allowed")
		}
		return a / b, nil
	case "power", "^", "exponentiation", "pow":
		return math.Pow(a, b), nil
	case "sqrt", "square_root", "squareroot":
		if a < 0 {
			return 0, errors.New("square root of a negative number is not allowed")
		}
		return math.Sqrt(a), nil
	case "percentage", "percent":
		if b == 0 {
			return 0, errors.New("percentage denominator cannot be zero")
		}
		return (a / b) * 100, nil
	default:
		return 0, errors.New("unsupported operation")
	}
}
