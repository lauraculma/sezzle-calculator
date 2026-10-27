package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCalculateHandler(t *testing.T) {
	tests := []struct {
		name       string
		method     string
		body       string
		wantStatus int
		wantBody   string
	}{
		{
			name:       "successful addition",
			method:     http.MethodPost,
			body:       `{"operation":"add","a":10,"b":5}`,
			wantStatus: http.StatusOK,
			wantBody:   `"result":15`,
		},
		{
			name:       "division by zero",
			method:     http.MethodPost,
			body:       `{"operation":"divide","a":10,"b":0}`,
			wantStatus: http.StatusBadRequest,
			wantBody:   "division by zero",
		},
		{
			name:       "unsupported operation",
			method:     http.MethodPost,
			body:       `{"operation":"unknown","a":2,"b":3}`,
			wantStatus: http.StatusBadRequest,
			wantBody:   "unsupported operation",
		},
		{
			name:       "invalid JSON",
			method:     http.MethodPost,
			body:       `invalid`,
			wantStatus: http.StatusBadRequest,
			wantBody:   "invalid JSON",
		},
		{
			name:       "wrong HTTP method",
			method:     http.MethodGet,
			body:       "",
			wantStatus: http.StatusMethodNotAllowed,
			wantBody:   "method not allowed",
		},
		{
			name:       "CORS preflight",
			method:     http.MethodOptions,
			body:       "",
			wantStatus: http.StatusNoContent,
			wantBody:   "",
		},
		{
			name:       "unknown JSON field",
			method:     http.MethodPost,
			body:       `{"operation":"add","a":10,"b":5,"extra":true}`,
			wantStatus: http.StatusBadRequest,
			wantBody:   "invalid JSON request",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(
				tt.method,
				"/api/calculate",
				strings.NewReader(tt.body),
			)
			recorder := httptest.NewRecorder()

			calculateHandler(recorder, req)

			if recorder.Code != tt.wantStatus {
				t.Fatalf(
					"status = %d, want %d; body = %s",
					recorder.Code,
					tt.wantStatus,
					recorder.Body.String(),
				)
			}

			if tt.wantBody != "" && !strings.Contains(recorder.Body.String(), tt.wantBody) {
				t.Errorf(
					"body = %s, want it to contain %q",
					recorder.Body.String(),
					tt.wantBody,
				)
			}
		})
	}
}
