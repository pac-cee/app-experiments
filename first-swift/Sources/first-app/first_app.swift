// The Swift Programming Language
// https://docs.swift.org/swift-book

// Basic struct to represent a person
struct Person {
    var name: String
    var age: Int
    
    func greet() -> String {
        return "Hello, my name is \(name) and I am \(age) years old!"
    }
}

// Main function to demonstrate usage
@main
public struct FirstApp {
    public static func main() {
        // Create a new person
        let person = Person(name: "Alex", age: 25)
