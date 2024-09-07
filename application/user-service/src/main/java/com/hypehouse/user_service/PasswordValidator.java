package com.hypehouse.user_service;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<PasswordConstraint, String> {

    @Override
    public void initialize(PasswordConstraint constraintAnnotation) {
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.isEmpty()) {
            return false;
        }

        boolean hasLowercase = false;
        boolean hasUppercase = false;
        boolean hasSpecial = false;

        for (char c : password.toCharArray()) {
            if (Character.isLowerCase(c)) {
                hasLowercase = true;
            } else if (Character.isUpperCase(c)) {
                hasUppercase = true;
            } else if (!Character.isLetterOrDigit(c)) {
                hasSpecial = true;
            }

            if (hasLowercase && hasUppercase && hasSpecial) {
                return true;
            }
        }

        return false;
    }
}
