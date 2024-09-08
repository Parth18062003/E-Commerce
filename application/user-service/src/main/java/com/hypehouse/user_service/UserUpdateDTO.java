package com.hypehouse.user_service;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserUpdateDTO {
    private String username;
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "Name should only contain alphabetic characters and spaces")
    private String firstName;
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "Name should only contain alphabetic characters and spaces")
    private String lastName;
    @Email(message = "Email should be valid")
    private String email;
    @Pattern(regexp = "\\d{10}", message = "Phone number should be 10 digits")
    private String phoneNumber;
    private String address;
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "City should only contain alphabetic characters and spaces")
    private String city;
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "State should only contain alphabetic characters and spaces")
    private String state;
    @Pattern(regexp = "\\d{6}", message = "Postal code should be 6 digits")
    private String postalCode;
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "Country should only contain alphabetic characters and spaces")
    private String country;

    public UserUpdateDTO() {
    }

    public UserUpdateDTO(String username,String firstName, String lastName, String email, String phoneNumber,
                         String address, String city, String state, String postalCode, String country) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;
    }

    // Getters and setters for all fields
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
