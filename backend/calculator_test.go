package main

import (
	"math"
	"testing"
)

func TestCalculate(t *testing.T) {
	tests := []struct {
		name      string
		op        string
		a, b      float64
		want      float64
		wantError bool
	}{
		{"addition", "add", 10, 5, 15, false},
		{"subtraction", "subtract", 10, 5, 5, false},
		{"multiplication", "multiply", 10, 5, 50, false},
		{"division", "divide", 10, 5, 2, false},
		{"division by zero", "divide", 10, 0, 0, true},
		{"power", "power", 2, 3, 8, false},
		{"sqrt", "sqrt", 9, 0, 3, false},
		{"sqrt negative", "sqrt", -9, 0, 0, true},
		{"percentage", "percentage", 25, 100, 25, false},
		{"percentage denominator zero", "percentage", 25, 0, 0, true},
		{"invalid operation", "unknown", 10, 5, 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Calculate(tt.op, tt.a, tt.b)

			if (err != nil) != tt.wantError {
				t.Fatalf("error = %v, wantError = %v", err, tt.wantError)
			}

			if !tt.wantError {
				if math.Abs(got-tt.want) > 1e-9 {
					t.Errorf("got %v, want %v", got, tt.want)
				}
			}
		})
	}
}
