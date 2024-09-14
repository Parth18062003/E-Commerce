package com.hypehouse.user_service;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

@Entity
@Table(name = "roles")
public class Role implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use auto-increment for the primary key
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "name", unique = true, nullable = false)
    @NotBlank(message = "Role name is mandatory")
    private String name;

    // Default constructor
    public Role() {
    }

    // Parameterized constructor
    public Role(String name) {
        this.name = name;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
