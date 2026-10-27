# Etapa 1: compilar
FROM golang:1.27.3-alpine AS build
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o /server .

# Etapa 2: ejecutar
FROM alpine:3.22
RUN adduser -D appuser
USER appuser
COPY --from=build /server /server
EXPOSE 8080
CMD ["/server"]
