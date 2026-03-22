# เปลี่ยนเป็น 1.24-alpine เพื่อรองรับ go.mod รุ่นใหม่
FROM golang:1.25.6-alpine AS builder

WORKDIR /app
COPY backend/go.mod ./
# COPY backend/go.sum ./
RUN go mod download

COPY backend/ .
COPY frontend/ ./frontend
RUN go build -o main .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/frontend ./frontend
EXPOSE 8080
CMD ["./main"]
