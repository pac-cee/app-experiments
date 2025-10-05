// auth_example_golang.go
// Minimal Go authentication example: registration & login with JWT

package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "sync"
    "time"

    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"
    "github.com/pquerna/otp/totp"
)

type User struct {
    Email        string
    PasswordHash string
    TOTPSecret   string
}

var (
    users    = make(map[string]*User)
    usersMux = sync.Mutex{}
    jwtKey   = []byte("supersecretkey")
)

func register(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }
    json.NewDecoder(r.Body).Decode(&req)
    usersMux.Lock()
    defer usersMux.Unlock()
