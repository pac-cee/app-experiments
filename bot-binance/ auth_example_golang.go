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
